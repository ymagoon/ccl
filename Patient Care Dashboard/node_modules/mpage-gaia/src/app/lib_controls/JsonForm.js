import * as Fusion from "MPageFusion";

const FormTextBox = Fusion.composite.form.FormTextBox;
const FormCheckBox = Fusion.composite.form.FormCheckbox;

const CONTROL_TYPES = {
    TEXTBOX: "textbox",
    CHECKBOX: "checkbox",
    TEXTARRAY: "textarray"
};

const FORM_CHANGE = "Internal::JsonForm::FormChange";
const TEXTBOX_ARRAY_CHANGE = "Internal::JsonForm::TextboxArrayChange";


/**
 * Creates a new form control based on a form entry JSON.
 *
 * EXAMPLE FORM ENTRY
 *
 * { key : "personName", label : "Person Name", type: CONTROL_TYPES.TEXTBOX }
 *
 * @param {*} jsonObject user provided json object with the form's values
 * @param {*} formEntry JSON that defines the control
 * @returns {UIComponent} component equivalent to the form entry
 **/
const createControl = (jsonObject) => (formEntry) => {
    switch (formEntry.type) {
    case CONTROL_TYPES.TEXTBOX:
        return new FormTextBox({
            _formKey: formEntry.key,
            display: formEntry.label,
            value: jsonObject[formEntry.key],
            valueChangeEventName: FORM_CHANGE
        });
    case CONTROL_TYPES.TEXTARRAY:
        return new FormTextBox({
            _formKey: formEntry.key,
            display: formEntry.label,
            value: jsonObject[formEntry.key] ?
                jsonObject[formEntry.key].join(",") : "",
            valueChangeEventName: TEXTBOX_ARRAY_CHANGE
        });
    case CONTROL_TYPES.CHECKBOX:
        return new FormCheckBox({
            _formKey: formEntry.key,
            display: formEntry.label,
            value: jsonObject[formEntry.key],
            valueChangeEventName: FORM_CHANGE
        });
    }
    return null;
};

/**
 * Transforms the event of an internal control to emit a "changeEventName"
 * with the updated jsonObject as parameter.
 * @param {UIComponent} control emitting the event
 * @param {String} eventName the child event name
 * @param {Function} valueFun function that returns the form control value
 * @returns {UIComponent} the control
 */
const convertEvent = (control, eventName, valueFun) =>
    control.convertEventUsingProp(
        eventName,
        "changeEventName",
        (source, value) => [
            control,
            Object.assign(
                {},
                control.getProp("jsonObject"),
                { [source.getProp("_formKey")] : valueFun(value) }
            )
        ]
    );

class JsonForm extends Fusion.UIComponent {
    initialProps() {
        return {
            formDefinition: [],
            jsonObject: {},
            changeEventName: "JsonForm::ObjectChanged"
        };
    };

    dependentPropChangeHandlers() {
        return [
            [
                "jsonObject", "formDefinition",
                (jsonObject, formDefinition) =>
                    this.replaceAllChildren(
                        formDefinition.map(createControl(jsonObject))
                    )
            ]
        ];
    }

    afterCreate() {
        convertEvent(
            this,
            FORM_CHANGE,
            (value) => value.value
        );
        convertEvent(
            this,
            TEXTBOX_ARRAY_CHANGE,
            (value) => value.value.split(",")
        );
    }

    view(el) {
        return this.renderChildren();
    }
}

JsonForm.CONTROL_TYPES = CONTROL_TYPES;

export default JsonForm;
