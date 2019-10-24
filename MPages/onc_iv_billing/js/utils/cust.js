if (/MSIE (\d+\.\d+);/.test(navigator.userAgent))
{ //test for MSIE x.x;
    var ieVersion = new Number(RegExp.$1) // capture x.x portion and store as a number
}
else
{
    var ieVersion = 0;
}

function ConfigurePage()
{

    var js_criterion = JSON.parse(m_criterionJSON).CRITERION;

    var criterion = new MP_Core.Criterion(js_criterion, js_criterion.STATIC_CONTENT);

    var js_reportIds = JSON.parse(reportIds)
    var reportValues = js_reportIds.REPORTID_REC.QUAL
    var ar = [];
    for (var i = 0; i < reportValues.length; i++)
    {
        ar.push(reportValues[i].VALUE);
    }

    var loadingPolicy = new MP_Bedrock.LoadingPolicy();
    loadingPolicy.setLoadPageDetails(false);
    loadingPolicy.setLoadComponentBasics(true);
    loadingPolicy.setCategoryMean(criterion.category_mean);
    loadingPolicy.setCriterion(criterion);
    loadingPolicy.setCustomizeView(true);

    var prefManager = MP_Core.AppUserPreferenceManager;
    prefManager.Initialize(criterion, criterion.category_mean);
    prefManager.LoadPreferences();

    var components = MP_Bedrock.MPage.Component.LoadBedrockComponents(loadingPolicy, ar, null, null);

    MP_Util.Doc.CustomizeLayout(i18n.discernabu.USER_CUSTOMIZATION, components, criterion);

    //JQuery sortable set up
    $(".cust-col").sortable({ connectWith: '.cust-col' }, { zIndex: 1005 }, { appendTo: 'body' });
}

