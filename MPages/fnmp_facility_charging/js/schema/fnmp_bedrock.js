/**
* Project: fnmp_bedrock
* Derived from: http://scm.discern-abu.cerner.corp/svn/core-components/trunk/javascript/schema/mp_bedrock2.js
* Version 1.0.0
*/
function BedrockMPage(categoryMean, componentMapping)
{
    this.mean = categoryMean;
    this.componentMapping = componentMapping;

    //public methods
    BedrockMPage.method('getCategoryMean', function ()
    {
        return mean;
    });
}

BedrockMPage.inherits(MPage);

function BedrockMPageGroupValue()
{
    m_sequence = 0;
    m_description = "";

    MPageGroupValue.method("getSequence", function ()
    {
        return this.m_sequence;
    })
    MPageGroupValue.method("setSequence", function (value)
    {
        this.m_sequence = value;
    })
    MPageGroupValue.method("getDescription", function ()
    {
        return this.m_description;
    })
    MPageGroupValue.method("setDescription", function (value)
    {
        this.m_description = value;
    })
}

BedrockMPageGroupValue.inherits(MPageGroupValue);

/**
* Bedrock schema methods for loading a MPage utilizing the bedrock configuration
* @namespace MP_Bedrock
* @static
* @global
*/
var MP_Bedrock = function ()
{
    return {
        LoadingPolicy: function ()
        {
            var m_loadPageDetails = false;
            var m_loadComponentBasic = false;
            var m_loadComponentDetail = false;
            var m_loadCustomizeView = false;
            var m_categoryMean = "";
            var m_criterion = null;

            this.setLoadPageDetails = function (value)
            {
                m_loadPageDetails = value;
            }
            this.getLoadPageDetails = function ()
            {
                return m_loadPageDetails;
            }
            this.setLoadComponentBasics = function (value)
            {
                m_loadComponentBasic = value;
            }
            this.getLoadComponentBasics = function ()
            {
                return m_loadComponentBasic;
            }
            this.setLoadComponentDetails = function (value)
            {
                m_loadComponentDetail = value;
            }
            this.getLoadComponentDetails = function ()
            {
                return m_loadComponentDetail;
            }
            this.setCategoryMean = function (value)
            {
                m_categoryMean = value;
            }
            this.getCategoryMean = function ()
            {
                return m_categoryMean;
            }
            this.setCriterion = function (value)
            {
                m_criterion = value;
            }
            this.getCriterion = function ()
            {
                return m_criterion;
            }
            this.setCustomizeView = function (value)
            {
                m_loadCustomizeView = value;
            }
            this.getCustomizeView = function ()
            {
                return m_loadCustomizeView;
            }
        }
    }
} ();

MP_Bedrock.MPage = function ()
{
    return {
    LoadBedrockMPage: function (loadingPolicy, componentMapping, funcFilterMapping, componentFunctions)
    {
        var categoryMean = loadingPolicy.getCategoryMean();
        var returnPage = new BedrockMPage(categoryMean, componentMapping);
        var criterion = loadingPolicy.getCriterion();
        criterion.category_mean = categoryMean;
        var prefManager = MP_Core.AppUserPreferenceManager;
        prefManager.Initialize(criterion, categoryMean);
        prefManager.LoadPreferences();
        returnPage.setCriterion(criterion);
        returnPage.setCustomizeView(loadingPolicy.getCustomizeView());

        if (m_jsonTextPage)
        {
            var recordData = m_jsonTextPage.RECORD_DATA;
            if (recordData.MPAGE.length > 0)
            {
                var bedrockPage = recordData.MPAGE[0];  //only 1 page for retrieval
                returnPage.setPageId(bedrockPage.BR_DATAMART_CATEGORY_ID);

                var components = bedrockPage.COMPONENT;
                for (var y = 0, yl = components.length; y < yl; y++)
                {
                    var jsonComponent = components[y];
            	    returnPage.addComponentId(jsonComponent.BR_DATAMART_REPORT_ID + ".0");
                }
            }
        }
        else
        {
            var timerA = new Date();
            var info = new XMLCclRequest();
            info.onreadystatechange = function ()
            {
                if (this.readyState == 4 && this.status == 200)
                {
                    m_jsonTextPage = JSON.parse(this.responseText);
                    var recordData = m_jsonTextPage.RECORD_DATA;
                    if (recordData.MPAGE.length > 0)
                    {
                        var bedrockPage = recordData.MPAGE[0];  //only 1 page for retrieval
                        returnPage.setPageId(bedrockPage.BR_DATAMART_CATEGORY_ID);

                        var components = bedrockPage.COMPONENT;
                        for (var y = 0, yl = components.length; y < yl; y++)
                        {
                            var jsonComponent = components[y];
                            returnPage.addComponentId(jsonComponent.BR_DATAMART_REPORT_ID + ".0");
                        }
                    }
                }
                if (this.readyState == 4)
                {
                    MP_Util.ReleaseRequestReference(this);
                }
            }

            info.open('GET', "FNMP_GET_BR_MPAGE", false);  // call service script and send the parameter string

            var ar = ["^MINE^", "^" + categoryMean + "^"];
            info.send(ar.join(","));
            var timerB = new Date();
            var loadBRMpage = (timerB.getTime() - timerA.getTime()) / 1000;
            logBRPage = "fnmp_get_br_mpage:" + ar.join(",") + logSeperator + loadBRMpage;
        }

        var components = MP_Bedrock.MPage.Component.LoadBedrockComponents(loadingPolicy, returnPage.getComponentIds(), componentMapping, componentFunctions);
        returnPage.setComponents(components);
        return returnPage;
    }
    }
} ();

MP_Bedrock.MPage.Component = function ()
{
    return {
    LoadBedrockComponents: function (loadingPolicy, compIdAr, componentMapping, componentFunctions)
    {
        if (compIdAr != null && compIdAr.length > 0)
        {
            var componentlist = [];
            var criterion = loadingPolicy.getCriterion();
            if (m_jsonTextComponent)
            {
                componentlist = PerformComponentPopulation(criterion, componentMapping, componentFunctions);
            }
            else
            {
                var timerA = new Date();
                var info = new XMLCclRequest();
                info.onreadystatechange = function ()
                {
                    if (this.readyState == 4 && this.status == 200)
                    {
                        m_jsonTextComponent = JSON.parse(info.responseText);
                        componentlist = PerformComponentPopulation(criterion, componentMapping, componentFunctions);
                    }

                    if (this.readyState == 4)
                    {
                        MP_Util.ReleaseRequestReference(this);
                    }
                }
                info.open('GET', "FNMP_GET_BR_COMPONENT", false);

                var sComponentIds = (compIdAr != null && compIdAr.length > 0) ? "value(" + compIdAr.join(",") + ")" : "0.0";
                var ar = ["^MINE^", sComponentIds, criterion.position_cd + ".0"];
                info.send(ar.join(","));

                var timerB = new Date();
                var loadBRComponent = (timerB.getTime() - timerA.getTime()) / 1000;
                logBRComp = "fnmp_get_br_component:" + ar.join(",") + logSeperator + loadBRComponent;
            }
            return componentlist;
        }
    }
    }

    function GetFilterValues(jsonFilter)
    {
        var aReturn = [];
        for (var x = 0, xl = jsonFilter.VALUES.length; x < xl; x++)
        {
            var jsonValue = jsonFilter.VALUES[x];
            var value = new BedrockMPageGroupValue();
            value.setId(jsonValue.PARENT_ENTITY_ID);
            value.setName(jsonValue.PARENT_ENTITY_NAME);
            value.setDescription(jsonValue.FREETEXT_DESC);
            value.setSequence(jsonValue.GROUP_SEQ);
            aReturn.push(value);
        }
        return aReturn;
    }
    function GetFunctionByFilterMean(jsFuncs, mean)
    {
        var funcs = jsFuncs.FUNCTIONS;
        for (var x = 0, xl = funcs.length; x < xl; x++)
        {
            var func = funcs[x];
            if (func && func.FILTER_MEAN == mean)
                return funcs[x];
        }
        return null;
    }
    function GetValueFromComponentFunc(func, aValues)
    {
        var ar = [];
        for (var x = 0, xl = aValues.length; x < xl; x++)
        {
            var val = aValues[x];
            switch (func.FIELD)
            {
                case "FREETEXT_DESC":
                    ar.push(val.getDescription());
                    break;
                case "PARENT_ENTITY_ID":
                    ar.push(val.getId());
                    break
                default:
                    break;
            }
        }
        var strFunc = "";
        switch (func.TYPE)
        {
            case "Array":
                strFunc = "component." + func.NAME + "([" + ar.join(",") + "])";
                break;
            case "String":
                strFunc = "component." + func.NAME + "('" + ar.join(",") + "')";
                break;
            case "Number":
                strFunc = "component." + func.NAME + "(" + ar.join(",") + ")";
                break;
            case "Boolean":
                var bVal = (ar[0] == "1") ? true : false;
                strFunc = "component." + func.NAME + "(" + bVal + ")";
                break;
            default:
                break;
        }
        return strFunc;
    }

    function PerformComponentPopulation(_criterion, _componentMapping, _componentFunctions)
    {
        var componentlist = [];
        var bedrockComponent = m_jsonTextComponent.RECORD_DATA;
        for (var x = bedrockComponent.COMPONENT.length; x--;)
        {
            var jsonComponent = bedrockComponent.COMPONENT[x];
            var componentType = MP_Util.GetValueFromArray(jsonComponent.REPORT_MEAN, _componentMapping);
            if (componentType != null)
            {
                var jsComponentFunc = null;
                var component = new componentType(_criterion);

                component.setCustomizeView(false);
                component.setComponentId(jsonComponent.BR_DATAMART_FILTER_ID);
                component.setReportId(jsonComponent.BR_DATAMART_REPORT_ID);
                component.setExpanded(jsonComponent.EXPANDED);
                component.setColumn(jsonComponent.COL_SEQ);
                component.setSequence(jsonComponent.ROW_SEQ);
                component.setPageGroupSequence(jsonComponent.GROUP_SEQ);

                component.setLabel(jsonComponent.LABEL);
                component.setLink(jsonComponent.LINK);
                component.setResultsDisplayEnabled(jsonComponent.TOTAL_RESULTS);
                component.setXofYEnabled(jsonComponent.X_OF_Y);
                component.setScrollNumber(jsonComponent.SCROLL_NUM);
                component.setScrollingEnabled(jsonComponent.SCROLL_ENABLED);

                var componentFunc = MP_Util.GetValueFromArray(jsonComponent.REPORT_MEAN, _componentFunctions);
                if (componentFunc != null)
                    jsComponentFunc = JSON.parse(componentFunc);
                for (var y = 0, yl = jsonComponent.FILTER.length; y < yl; y++)
                {
                    var filter = jsonComponent.FILTER[y];
                    var aValue = GetFilterValues(filter);
                    if (jsComponentFunc != null)
                    {
                        var filterFunc = GetFunctionByFilterMean(jsComponentFunc, filter.FILTER_MEAN);
                        if (filterFunc)
                        {
                            var strFunc = GetValueFromComponentFunc(filterFunc, aValue);
                            var ret = eval(strFunc);
                        }
                    }
                }
                componentlist.push(component);
            }
        }
        return componentlist;
    }

} ();
