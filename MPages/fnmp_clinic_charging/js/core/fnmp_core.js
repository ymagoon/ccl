/**
* Project: fnmp_core
* Version 1.0.0
* Derived from mp_core: http://scm.discern-abu.cerner.corp/svn/core-components/trunk/javascript/core/mp_core.js
*/
/*
The scope of an MPage object and Components are during rendering of the page.  However,
once the page has been rendered these items are lost.  Because there is a need to refresh 
components, the components on a 'page' must be globally stored to allow for refreshing of data.
*/
var CERN_MPageComponents = null;
var CERN_TabManagers = null;
var CERN_WizardComponents = null;
var STR_PAD_LEFT = 1;
var STR_PAD_RIGHT = 2;
var STR_PAD_BOTH = 3;
function AvoidSubmit()
{
    return false;
}

Array.prototype.addAll = function (v)
{
    if (v && v.length > 0)
    {
        for (var x = 0, xl = v.length; x < xl; x++)
        {
            this.push(v[x])
        }
    }
};

/**
* Utility methods
* @namespace MP_Core
* @static
* @global
*/
var MP_Core = function ()
{
    return {
        Criterion: function (person_id, encntr_id, provider_id, executable, static_content, position_cd, ppr_cd, debug_ind, help_file_local_ind, category_mean, backend_loc)
        {
            var m_patInfo = null;
            var m_prsnlInfo = null;

            this.person_id = person_id;
            this.encntr_id = encntr_id;
            this.provider_id = provider_id;
            this.executable = executable;
            this.static_content = static_content;
            this.position_cd = position_cd;
            this.ppr_cd = ppr_cd;
            this.debug_ind = debug_ind;
            this.help_file_local_ind = help_file_local_ind;
            this.category_mean = category_mean;
            this.backend_loc = backend_loc;

            this.setPatientInfo = function (value)
            {
                m_patInfo = value;
            }
            this.getPatientInfo = function ()
            {
                return m_patInfo;
            }

            this.getPersonnelInfo = function ()
            {
                if (!m_prsnlInfo)
                    m_prsnlInfo = new MP_Core.PersonnelInformation(this.provider_id, this.person_id);
                return m_prsnlInfo;
            }
        },
        PatientInformation: function ()
        {
            var m_dob = null;
            var m_sex = null;

            this.setSex = function (value)
            {
                m_sex = value;
            }
            this.getSex = function ()
            {
                return m_sex;
            }
            this.setDOB = function (value)
            {
                m_dob = value;
            }
            this.getDOB = function ()
            {
                return m_dob;
            }
        },

        ScriptRequest: function (component, loadTimerName)
        {
            var m_comp = component;
            var m_load = loadTimerName;
            var m_name = "";
            var m_programName = ""
            var m_params = null;
            var m_async = true;

            this.getComponent = function ()
            {
                return m_comp;
            }
            this.getLoadTimer = function ()
            {
                return m_load;
            }

            this.setName = function (value)
            {
                m_name = value;
            }
            this.getName = function ()
            {
                return m_name;
            }
            this.setProgramName = function (value)
            {
                m_programName = value;
            }
            this.getProgramName = function ()
            {
                return m_programName;
            }
            this.setParameters = function (value)
            {
                m_params = value;
            }
            this.getParameters = function ()
            {
                return m_params;
            }
            this.setAsync = function (value)
            {
                m_async = value;
            }
            this.isAsync = function ()
            {
                return m_async;
            }
        },
        ScriptReply: function (component)
        {
            var m_name = ""; //used to syne a request to a reply
            var m_status = "F"; //by default every script reply is 'f'ailed unless otherwise noted
            var m_err = "";
            var m_resp = null;
            var m_comp = component;

            this.setName = function (value)
            {
                m_name = value;
            }
            this.getName = function ()
            {
                return m_name;
            }
            this.setStatus = function (value)
            {
                m_status = value;
            }
            this.getStatus = function ()
            {
                return m_status;
            }
            this.setError = function (value)
            {
                m_err = value;
            }
            this.getError = function ()
            {
                return m_err;
            }
            this.setResponse = function (value)
            {
                m_resp = value;
            }
            this.getResponse = function ()
            {
                return m_resp;
            }
            this.getComponent = function ()
            {
                return m_comp;
            }
        },
        PersonnelInformation: function (prsnlId, patientId)
        {
            var m_prsnlId = prsnlId;
            var m_viewableEncntrs = null; //if remain null, error in retrieval of viewable encntr
            //load valid encounter list from patcon wrapper
            var patConObj = null;
            try
            {
                patConObj = window.external.DiscernObjectFactory("PVCONTXTMPAGE");
                if (patConObj)
                    m_viewableEncntrs = patConObj.GetValidEncounters(patientId);
            }
            catch (e)
            {
            }
            finally
            {
                //release used memory
                patConObj = null;
            }

            this.getPersonnelId = function ()
            {
                return m_prsnlId;
            }
            /**
            * Returns the associated encounter that the provide has the ability to see
            */
            this.getViewableEncounters = function ()
            {
                return m_viewableEncntrs;
            }
        },
        XMLCclRequestWrapper: function (component, program, paramAr, async)
        {
            var timerLoadComponent = MP_Util.CreateTimer(component.getComponentLoadTimerName(), component.getCriterion().category_mean);
            var info = new XMLCclRequest();
            info.onreadystatechange = function ()
            {
                if (this.readyState == 4 && this.status == 200)
                {
                    try
                    {
                        var jsonEval = JSON.parse(this.responseText);
                        var recordData = jsonEval.RECORD_DATA;
                        if (recordData.STATUS_DATA.STATUS == "Z")
                        {
                            var countText = (component.isLineNumberIncluded() ? "(0)" : "")
                            MP_Util.Doc.FinalizeComponent(MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace()), component, countText);
                        }
                        else if (recordData.STATUS_DATA.STATUS == "S")
                        {
                            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName(), component.getCriterion().category_mean);
                            try
                            {
                                var rootComponentNode = component.getRootComponentNode();
                                var secTitle = Util.Style.g("sec-total", rootComponentNode, "span");
                                secTitle[0].innerHTML = i18n.RENDERING_DATA + "...";
                                component.HandleSuccess(recordData);
                            }
                            catch (err)
                            {
                                if (timerRenderComponent)
                                {
                                    timerRenderComponent.Abort();
                                    timerRenderComponent = null;
                                }
                                throw (err);
                            }
                            finally
                            {
                                if (timerRenderComponent)
                                    timerRenderComponent.Stop();
                            }
                        }
                        else
                        {
                            var errMsg = [];
                            errMsg.push("<b>", i18n.DISCERN_ERROR, "</b><br><ul><li>", i18n.STATUS, ": ", this.status, "</li><li>", i18n.REQUEST, ": ", this.requestText, "</li>");
                            var statusData = recordData.STATUS_DATA;
                            if (statusData.SUBEVENTSTATUS.length && statusData.SUBEVENTSTATUS.length > 0)
                            {
                                for (var x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++)
                                {
                                    var ss = statusData.SUBEVENTSTATUS[x];
                                    errMsg.push("<li>", i18n.ERROR_OPERATION, ": ", ss.OPERATIONNAME, "</li><li>", i18n.ERROR_OPERATION_STATUS, ": ", ss.OPERATIONSTATUS, "</li><li>", i18n.ERROR_TARGET_OBJECT, ": ", ss.TARGETOBJECTNAME, "</li><li>", i18n.ERROR_TARGET_OBJECT_VALUE, ": ", ss.TARGETOBJECTVALUE, "</li>");
                                }
                            }
                            else if (statusData.SUBEVENTSTATUS.length == undefined)
                            {
                                var ss = statusData.SUBEVENTSTATUS;
                                errMsg.push("<li>", i18n.ERROR_OPERATION, ": ", ss.OPERATIONNAME, "</li><li>", i18n.ERROR_OPERATION_STATUS, ": ", ss.OPERATIONSTATUS, "</li><li>", i18n.ERROR_TARGET_OBJECT, ": ", ss.TARGETOBJECTNAME, "</li><li>", i18n.ERROR_TARGET_OBJECT_VALUE, ": ", ss.TARGETOBJECTVALUE, "</li>");
                            }
                            errMsg.push("</ul>")
                            var countText = (component.isLineNumberIncluded() ? "(0)" : "")
                            MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), component, countText);
                        }
                    }
                    catch (err)
                    {
                        var errMsg = [];
                        errMsg.push("<b>", i18n.JS_ERROR, "</b><br><ul><li>", i18n.MESSAGE, ": ", err.message, "</li><li>", i18n.NAME, ": ", err.name, "</li><li>", i18n.NUMBER, ": ", (err.number & 0xFFFF), "</li><li>", i18n.DESCRIPTION, ": ", err.description, "</li></ul>");
                        MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), component, countText);

                        if (timerLoadComponent)
                        {
                            timerLoadComponent.Abort();
                            timerLoadComponent = null;
                        }
                    }
                    finally
                    {
                        if (timerLoadComponent)
                            timerLoadComponent.Stop();
                    }
                }
                else if (this.readyState == 4 && this.status != 200)
                {
                    var errMsg = [];
                    errMsg.push("<b>", i18n.DISCERN_ERROR, "</b><br><ul><li>", i18n.STATUS, ": ", this.status, "</li><li>", i18n.REQUEST, ": ", this.requestText, "</li></ul>");
                    MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), component, "");
                    if (timerLoadComponent)
                        timerLoadComponent.Abort();
                }
                if (this.readyState == 4)
                {
                    MP_Util.ReleaseRequestReference(this);
                }
            }
            info.open('GET', program, async);
            info.send(paramAr.join(","));
        },
        /*
        * As a means in which to provide the consumer to handle the response of the script request, this method
        * provide an encapsulated means in which to call the XMLCCLRequest and return a ReplyObject with data
        * about the response that can be utilized for evaluation.
        */
        XMLCCLRequestCallBack: function (component, request, funcCallback)
        {
            var timerLoad = MP_Util.CreateTimer(request.getLoadTimer());
            var info = new XMLCclRequest();
            var reply = new MP_Core.ScriptReply(component);
            reply.setName(request.getName());
            info.onreadystatechange = function ()
            {
                if (this.readyState == 4 && this.status == 200)
                {
                    try
                    {
                        var jsonEval = JSON.parse(info.responseText);
                        var recordData = jsonEval.RECORD_DATA;
                        var status = recordData.STATUS_DATA.STATUS;
                        reply.setStatus(status);
                        if (status == "Z")
                        {
                            //Pass response anyways
                            reply.setResponse(recordData);
                            funcCallback(reply);
                        }
                        else if (status == "S")
                        {
                            reply.setResponse(recordData);
                            funcCallback(reply);
                        }
                        else
                        {
                            var errMsg = [];
                            errMsg.push("<b>", i18n.DISCERN_ERROR, "</b><br><ul><li>", i18n.STATUS, ": ", this.status, "</li><li>", i18n.REQUEST, ": ", this.requestText, "</li>");
                            var statusData = recordData.STATUS_DATA;
                            if (statusData.SUBEVENTSTATUS.length && statusData.SUBEVENTSTATUS.length > 0)
                            {
                                for (var x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++)
                                {
                                    var ss = statusData.SUBEVENTSTATUS[x];
                                    errMsg.push("<li>", i18n.ERROR_OPERATION, ": ", ss.OPERATIONNAME, "</li><li>", i18n.ERROR_OPERATION_STATUS, ": ", ss.OPERATIONSTATUS, "</li><li>", i18n.ERROR_TARGET_OBJECT, ": ", ss.TARGETOBJECTNAME, "</li><li>", i18n.ERROR_TARGET_OBJECT_VALUE, ": ", ss.TARGETOBJECTVALUE, "</li>");
                                }
                            }
                            else if (statusData.SUBEVENTSTATUS.length == undefined)
                            {
                                var ss = statusData.SUBEVENTSTATUS;
                                errMsg.push("<li>", i18n.ERROR_OPERATION, ": ", ss.OPERATIONNAME, "</li><li>", i18n.ERROR_OPERATION_STATUS, ": ", ss.OPERATIONSTATUS, "</li><li>", i18n.ERROR_TARGET_OBJECT, ": ", ss.TARGETOBJECTNAME, "</li><li>", i18n.ERROR_TARGET_OBJECT_VALUE, ": ", ss.TARGETOBJECTVALUE, "</li>");
                            }
                            errMsg.push("</ul>")
                            reply.setError(errMsg.join(""));
                            funcCallback(reply);
                        }
                    }
                    catch (err)
                    {
                        var errMsg = [];
                        errMsg.push("<b>", i18n.DISCERN_ERROR, "</b><br><ul><li>", i18n.STATUS, ": ", this.status, "</li><li>", i18n.REQUEST, ": ", this.requestText, "</li></ul>");
                        reply.setError(errMsg.join(""));
                        if (timerLoad)
                        {
                            timerLoad.Abort();
                            timerLoad = null;
                        }
                    }
                    finally
                    {
                        if (timerLoad)
                        {
                            timerLoad.Stop();
                        }
                    }
                }
                else if (info.readyState == 4 && info.status != 200)
                {
                    var errMsg = [];
                    errMsg.push("<b>", i18n.DISCERN_ERROR, "</b><br><ul><li>", i18n.STATUS, ": ", this.status, "</li><li>", i18n.REQUEST, ": ", this.requestText, "</li></ul>");
                    reply.setError(errMsg.join(""));
                    if (timerLoad)
                        timerLoad.Abort();
                    funcCallback(reply);
                }
                if (this.readyState == 4)
                {
                    MP_Util.ReleaseRequestReference(this);
                }
            }
            info.open('GET', request.getProgramName(), request.isAsync());
            info.send(request.getParameters().join(","));
        },
        XMLCCLRequestThread: function (name, component, request)
        {
            var m_name = name;
            var m_comp = component;

            var m_request = request;
            m_request.setName(name);

            this.getName = function ()
            {
                return m_name;
            }
            this.getComponent = function ()
            {
                return m_comp;
            }
            this.getRequest = function ()
            {
                return m_request
            };
        },
        XMLCCLRequestThreadManager: function (callbackFunction, component, handleFinalize)
        {
            var m_threads = null;
            var m_replyAr = null;

            var m_isData = false;
            var m_isError = false;

            this.addThread = function (thread)
            {
                if (m_threads == null)
                    m_threads = [];

                m_threads.push(thread);
            }

            this.begin = function ()
            {
                if (m_threads && m_threads.length > 0)
                {
                    for (x = m_threads.length; x--; )
                    {
                        //start each xmlcclrequest
                        var thread = m_threads[x];
                        MP_Core.XMLCCLRequestCallBack(thread.getComponent(), thread.getRequest(), this.completeThread)
                    }
                }
                else
                {
                    if (handleFinalize)
                    {
                        var countText = (component.isLineNumberIncluded() ? "(0)" : "")
                        MP_Util.Doc.FinalizeComponent(MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace()), component, countText);
                    }
                    else
                    {
                        callbackFunction(null, component);
                    }
                }
            }

            this.completeThread = function (reply)
            {
                if (m_replyAr == null)
                    m_replyAr = [];

                if (reply.getStatus() == "S")
                    m_isData = true;
                else if (reply.getStatus() == "F")
                {
                    m_isError = true;
                }

                m_replyAr.push(reply);
                if (m_replyAr.length == m_threads.length)
                {
                    if (handleFinalize)
                    {
                        if (m_isError)
                        {
                            alert(m_isError)
                            //handle error response
                            var errMsg = [];
                            for (var x = m_replyAr.length; x--; )
                            {
                                var rep = m_replyAr[x];
                                if (rep.getStatus() == "F")
                                {
                                    errMsg.push(rep.getError());
                                }
                            }
                            MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("<br>")), component, "");
                        }
                        else if (!m_isData)
                        {
                            //handle no data
                            var countText = (component.isLineNumberIncluded() ? "(0)" : "")
                            MP_Util.Doc.FinalizeComponent(MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace()), component, countText);
                        }
                        else
                        {
                            callbackFunction(m_replyAr, component);
                        }
                    }
                    else
                    {
                        callbackFunction(m_replyAr, component);
                    }
                }
            }
        },
        MapObject: function (name, value)
        {
            this.name = name;
            this.value = value
        },
        /**
        * An object to store the attributes of a single tab.
        * @param {Object} key The id associated to the tab.
        * @param {Object} name The name to be displayed on the tab.
        * @param {Object} components The components to be associated to the tab.
        */
        TabItem: function (key, name, components, prefIdentifier)
        {
            this.key = key;
            this.name = name;
            this.components = components;
            this.prefIdentifier = prefIdentifier
        },
        TabManager: function (tabItem)
        {
            var m_isLoaded = false;
            var m_tabItem = tabItem;
            //By default a tab and all it's components are not fully expanded
            var m_isExpandAll = false;
            var m_isSelected = false;
            this.toggleExpandAll = function ()
            {
                m_isExpandAll = (!m_isExpandAll)

            }
            this.loadTab = function ()
            {
                if (!m_isLoaded)
                {
                    m_isLoaded = true;
                    var components = m_tabItem.components;
                    if (components)
                    {
                        for (var xl = components.length; xl--; )
                        {
                            var component = components[xl];
                            if (component.isDisplayable())
                                component.InsertData();
                        }
                    }
                }
            }
            this.getTabItem = function ()
            {
                return m_tabItem;
            }
            this.getSelectedTab = function ()
            {
                return m_isSelected;
            }
            this.setSelectedTab = function (value)
            {
                m_isSelected = value;
            }
        },
        ReferenceRangeResult: function ()
        {
            //results
            var m_valNLow = -1, m_valNHigh = -1, m_valCLow = -1, m_valCHigh = -1;
            //units of measure
            var m_uomNLow = null, m_uomNHigh = null, m_uomCLow = null, m_uomCHigh = null;
            this.init = function (refRange, codeArray)
            {
                m_valCLow = refRange.CRITICAL_LOW.NUMBER;
                if (refRange.CRITICAL_LOW.UNIT_CD != "")
                {
                    m_uomCLow = MP_Util.GetValueFromArray(refRange.CRITICAL_LOW.UNIT_CD, codeArray);
                }
                m_valCHigh = refRange.CRITICAL_HIGH.NUMBER;
                if (refRange.CRITICAL_HIGH.UNIT_CD != "")
                {
                    m_uomCHigh = MP_Util.GetValueFromArray(refRange.CRITICAL_HIGH.UNIT_CD, codeArray);
                }
                m_valNLow = refRange.NORMAL_LOW.NUMBER;
                if (refRange.NORMAL_LOW.UNIT_CD != "")
                {
                    m_uomNLow = MP_Util.GetValueFromArray(refRange.NORMAL_LOW.UNIT_CD, codeArray);
                }
                m_valNHigh = refRange.NORMAL_HIGH.NUMBER;
                if (refRange.NORMAL_HIGH.UNIT_CD != "")
                {
                    m_uomNHigh = MP_Util.GetValueFromArray(refRange.NORMAL_HIGH.UNIT_CD, codeArray);
                }
            }

            this.getNormalLow = function ()
            {
                return m_valNLow
            };
            this.getNormalHigh = function ()
            {
                return m_valNHigh
            };
            this.getNormalLowUOM = function ()
            {
                return m_uomNLow
            };
            this.getNormalHighUOM = function ()
            {
                return m_uomNHigh
            };
            this.getCriticalLow = function ()
            {
                return m_valCLow
            };
            this.getCriticalHigh = function ()
            {
                return m_valCHigh
            };
            this.getCriticalLowUOM = function ()
            {
                return m_uomCLow
            };
            this.getCriticalHighUOM = function ()
            {
                return m_uomCHigh
            };

            this.toNormalInlineString = function ()
            {
                var low = (m_uomNLow != null) ? m_uomNLow.display : "";
                var high = (m_uomNHigh != null) ? m_uomNHigh.display : "";
                if (m_valNLow != 0 || m_valNHigh != 0)
                    return (m_valNLow + "&nbsp;" + low + " - " + m_valNHigh + "&nbsp;" + high)
                else
                    return "";
            };
            this.toCriticalInlineString = function ()
            {
                var low = (m_uomCLow != null) ? m_uomCLow.display : "";
                var high = (m_uomCHigh != null) ? m_uomCHigh.display : "";
                if (m_valCLow != 0 || m_valCHigh != 0)
                    return (m_valCLow + "&nbsp;" + low + " - " + m_valCHigh + "&nbsp;" + high)
                else
                    return "";
            };
        },

        QuantityValue: function ()
        {
            var m_val, m_precision;
            var m_uom = null;
            var m_refRange = null;
            this.init = function (result, codeArray)
            {

                var quantityValue = result.QUANTITY_VALUE;
                var referenceRange = result.REFERENCE_RANGE;
                for (var l = 0, ll = quantityValue.length; l < ll; l++)
                {
                    var numRes = quantityValue[l].NUMBER;
                    m_precision = quantityValue[l].PRECISION;
                    if (!isNaN(numRes))
                    {
                        m_val = MP_Util.Measurement.SetPrecision(numRes, m_precision);
                    }
                    if (quantityValue[l].MODIFIER_CD != "")
                    {
                        var modCode = MP_Util.GetValueFromArray(quantityValue[l].MODIFIER_CD, codeArray);
                        if (modCode != null)
                            m_val = modCode.display + m_val;
                    }
                    if (quantityValue[l].UNIT_CD != "")
                    {
                        m_uom = MP_Util.GetValueFromArray(quantityValue[l].UNIT_CD, codeArray);
                    }
                    for (var m = 0, ml = referenceRange.length; m < ml; m++)
                    {
                        m_refRange = new MP_Core.ReferenceRangeResult();
                        m_refRange.init(referenceRange[m], codeArray);
                    }
                }
            }
            this.getValue = function ()
            {
                return m_val
            };
            this.getUOM = function ()
            {
                return m_uom
            };
            this.getRefRange = function ()
            {
                return m_refRange
            };
            this.getPrecision = function ()
            {
                return m_precision
            };
            this.toString = function ()
            {
                if (m_uom != null)
                    return (m_val + " " + m_uom.display);
                else
                    return m_val;
            }
        },
        //measurement.init(meas.EVENT_ID, meas.PERSON_ID, meas.ENCNTR_ID, eventCode, dateTime, MP_Util.Measurement.GetObject(meas.MEASUREMENTS[k], codeArray));
        Measurement: function ()
        {
            var m_eventId = 0.0;
            var m_personId = 0.0;
            var m_encntrId = 0.0;
            var m_eventCode = null;
            var m_dateTime = null;
            var m_updateDateTime = null;
            var m_result = null;
            var m_normalcy = null

            this.init = function (eventId, personId, encntrId, eventCode, dateTime, resultObj, updateDateTime)
            {
                m_eventId = eventId;
                m_personId = personId;
                m_encntrId = encntrId;
                m_eventCode = eventCode;
                m_dateTime = dateTime;
                m_result = resultObj;
                m_updateDateTime = updateDateTime;
            }
            this.getEventId = function ()
            {
                return m_eventId
            };
            this.getPersonId = function ()
            {
                return m_personId
            };
            this.getEncntrId = function ()
            {
                return m_encntrId
            };
            this.getEventCode = function ()
            {
                return m_eventCode
            };
            this.getDateTime = function ()
            {
                return m_dateTime
            };
            this.getUpdateDateTime = function ()
            {
                return m_updateDateTime
            };
            this.getResult = function ()
            {
                return m_result
            };
            this.setNormalcy = function (value)
            {
                m_normalcy = value
            };
            this.getNormalcy = function ()
            {
                return m_normalcy
            };
        },
        MenuItem: function ()
        {
            var m_name = "";
            var m_desc = "";
            var m_id = 0.0;

            this.setDescription = function (value)
            {
                m_desc = value;
            }
            this.getDescription = function ()
            {
                return m_desc;
            }
            this.setName = function (value)
            {
                m_name = value;
            }
            this.getName = function ()
            {
                return m_name;
            }
            this.setId = function (value)
            {
                m_id = value;
            }
            this.getId = function ()
            {
                return m_id;
            }
        },
        CriterionFilters: function (criterion)
        {
            var m_criterion = criterion;
            var m_evalAr = [];

            this.addFilter = function (type, value)
            {
                m_evalAr.push(new MP_Core.MapObject(type, value))
            }
            this.checkFilters = function ()
            {
                var pass = false;
                var patInfo = m_criterion.getPatientInfo();
                for (var x = m_evalAr.length; x--; )
                {
                    var filter = m_evalAr[x];
                    switch (filter.name)
                    {
                        case MP_Core.CriterionFilters.SEX_MEANING:
                            var sex = patInfo.getSex();
                            if (sex != null)
                            {
                                //alert("sex check: filter.value [" + filter.value + "] patInfo.sex [" + sex.meaning + "]")
                                if (filter.value == sex.meaning)
                                    continue;
                            }
                            return false;
                            break;
                        case MP_Core.CriterionFilters.DOB_OLDER_THAN:
                            var dob = patInfo.getDOB();
                            if (dob != null)
                            {
                                //alert("dob check: filter.value [" + filter.value + "] patInfo.dob [" + dob + "]")
                                if (dob <= filter.value)
                                    continue;
                            }
                            return false;
                            break;
                        case MP_Core.CriterionFilters.DOB_YOUNGER_THAN:
                            var dob = patInfo.getDOB();
                            if (dob != null)
                            {
                                //alert("dob check: filter.value [" + filter.value + "] patInfo.dob [" + dob + "]")
                                if (dob >= filter.value)
                                    continue;
                            }
                            return false;
                            break;
                        default:
                            alert("Unhandled criterion filter")
                            return false;
                    }
                }
                return true;
            }
        }
    };
} ();
//Constants for CriterionFilter items
MP_Core.CriterionFilters.SEX_MEANING = 1;
MP_Core.CriterionFilters.DOB_OLDER_THAN = 2;
MP_Core.CriterionFilters.DOB_YOUNGER_THAN = 3;


MP_Core.AppUserPreferenceManager = function ()
{
    var m_criterion = null;
    var m_prefIdent = "";
    var m_jsonObject = null;

    return {
        /**
        * Allows for the initialization of the manager to store what criterion and preference identifier to
        * utilize for retrieval of preferences
        * @param {Object} criterion
        * @param {Object} preferenceIdentifier
        */
        Initialize: function (criterion, preferenceIdentifier)
        {
            m_criterion = criterion;
            m_prefIdent = preferenceIdentifier;
            m_jsonObject = null;
        },
        LoadPreferences: function ()
        {
            if (m_criterion == null)
            {
                alert("Validation Failed: the AppUserPreferenceManager must be initialized prior to usage.")
                return null;
            }

            if (m_jsonObject != null)
                return;
            else
            {
                var info = new XMLCclRequest();
                info.onreadystatechange = function ()
                {
                    if (this.readyState == 4 && this.status == 200)
                    {
                        var jsonEval = JSON.parse(this.responseText);
                        var recordData = jsonEval.RECORD_DATA;
                        if (recordData.STATUS_DATA.STATUS == "S")
                        {
                            m_jsonObject = JSON.parse(recordData.PREF_STRING);
                        }
                        else if (recordData.STATUS_DATA.STATUS == "Z")
                        {
                            return;
                        }
                        else
                        {
                            var errAr = [];
                            var statusData = recordData.STATUS_DATA;
                            errAr.push("STATUS: " + statusData.STATUS)
                            for (var x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++)
                            {
                                var ss = statusData.SUBEVENTSTATUS[x];
                                errAr.push(ss.OPERATIONNAME, ss.OPERATIONSTATUS, ss.TARGETOBJECTNAME, ss.TARGETOBJECTVALUE);
                            }
                            window.status = "Error retrieving user preferences " + errAr.join(",");
                            return;
                        }
                    }
                    if (this.readyState == 4)
                    {
                        MP_Util.ReleaseRequestReference(this);
                    }

                }
                info.open('GET', "MP_GET_USER_PREFS", false);
                var ar = ["^mine^", m_criterion.provider_id + ".0", "^" + m_prefIdent + "^"];
                info.send(ar.join(","));
                return;
            }
        },
        /**
        * GetPreferences will return the users preferences for the application currently logged into.
        */
        GetPreferences: function ()
        {
            if (m_criterion == null)
            {
                alert("Validation Failed: the AppUserPreferenceManager must be initialized prior to usage.")
                return null;
            }
            if (m_jsonObject == null)
                this.LoadPreferences();

            return m_jsonObject;
        },
        SavePreferences: function ()
        {
            var body = document.body;
            var groups = Util.Style.g("col-group", body, "div")
            var grpId = 0;
            var colId = 0;
            var rowId = 0;
            var compId = 0;

            var jsonObject = new Object();
            var userPrefs = jsonObject.user_prefs = new Object();
            var pagePrefs = userPrefs.page_prefs = new Object();
            var components = pagePrefs.components = [];

            //alert("groups.length: " + groups.length)
            for (var x = 0, xl = groups.length; x < xl; x++)
            {
                grpId = x + 1; //TODO: be aware that when the organizer level component can be moved, this x+1 will need to be modified
                //get liquid layout
                var liqLay = Util.Style.g("col-outer1", groups[x], "div");
                if (liqLay.length > 0)
                {
                    //get each child column
                    var cols = Util.gcs(liqLay[0])
                    //	                alert("cols.length: " + cols.length)
                    for (var y = 0, yl = cols.length; y < yl; y++)
                    {
                        colId = y + 1;
                        var rows = Util.gcs(cols[y]);
                        //alert("rows.length: " + rows.length)
                        for (var z = 0, zl = rows.length; z < zl; z++)
                        {
                            var component = new Object()
                            rowId = z + 1;
                            compId = jQuery(rows[z]).attr('id');
                            //alert('component id = '+compId);
                            component.id = compId;
                            component.group_seq = grpId;
                            component.col_seq = colId;
                            component.row_seq = rowId;
                            if (jQuery(rows[z]).hasClass('closed'))
                                component.expanded = false;
                            else
                                component.expanded = true;
                            components.push(component);
                        }
                    }
                }
            }
            WritePreferences(jsonObject);
            m_jsonObject = jsonObject;
            history.back();
        },
        ClearPreferences: function ()
        {
            WritePreferences(null);
            history.back();
        },
        /**
        * Returns the json object associated to the primary div id of the component.  It is assumed LoadPreferences has been called prior to execution
        * @param {Object} id
        */
        GetComponentById: function (id)
        {
            if (m_jsonObject != null)
            {
                var components = m_jsonObject.user_prefs.page_prefs.components;
                for (var x = components.length; x--; )
                {
                    var component = components[x];
                    if (component.id == id)
                        return component;
                }
            }
            return null;
        }
    }
    function WritePreferences(jsonObject, successMessage)
    {
        var info = new XMLCclRequest();
        info.onreadystatechange = function ()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                var jsonEval = JSON.parse(this.responseText);
                var recordData = jsonEval.RECORD_DATA;
                if (recordData.STATUS_DATA.STATUS == "Z")
                {
                    m_jsonObject = null;
                }
                else if (recordData.STATUS_DATA.STATUS == "S")
                {
                    m_jsonObject = jsonObject;
                    if (successMessage != null && successMessage.length > 0)
                        alert(successMessage);
                }
                else
                {
                    var errAr = [];
                    var statusData = recordData.STATUS_DATA;
                    errAr.push("STATUS: " + statusData.STATUS)
                    for (var x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++)
                    {
                        var ss = statusData.SUBEVENTSTATUS[x];
                        errAr.push(ss.OPERATIONNAME, ss.OPERATIONSTATUS, ss.TARGETOBJECTNAME, ss.TARGETOBJECTVALUE);
                    }
                    window.status = "Error saving user preferences: " + errAr.join(",")
                }
            }
            if (this.readyState == 4)
            {
                MP_Util.ReleaseRequestReference(this);
            }
        }
        info.open('GET', "MP_MAINTAIN_USER_PREFS", false);
        var sJson = (jsonObject != null) ? JSON.stringify(jsonObject) : "";
        var ar = ["^mine^", m_criterion.provider_id + ".0", "^" + m_prefIdent + "^", "^" + sJson + "^"];
        info.send(ar.join(","));
    }
} ();

var MP_Util = function ()
{
    return {
        GetCriterion: function (js_criterion, static_content)
        {
            var jsCrit = js_criterion.CRITERION;
            var criterion = new MP_Core.Criterion(jsCrit.PERSON_ID,
				(jsCrit.ENCNTRS.length > 0) ? jsCrit.ENCNTRS[0].ENCNTR_ID : 0,
				jsCrit.PRSNL_ID,
				jsCrit.EXECUTABLE,
				static_content,
				jsCrit.POSITION_CD,
				jsCrit.PPR_CD,
				(jsCrit.DEBUG_IND == 1) ? true : false,
				jsCrit.HELP_FILE_LOCAL_IND,
				jsCrit.CATEGORY_MEAN,
				jsCrit.BACKEND_LOCATION
				);
            var codeArray = MP_Util.LoadCodeListJSON(jsCrit.CODES);
            var jsPatInfo = jsCrit.PATIENT_INFO;
            var patInfo = new MP_Core.PatientInformation();
            patInfo.setSex(MP_Util.GetValueFromArray(jsPatInfo.SEX_CD, codeArray));
            if (jsPatInfo.DOB != "")
            {
                var dt = new Date();
                dt.setISO8601(jsPatInfo.DOB)
                patInfo.setDOB(dt);
            }
            criterion.setPatientInfo(patInfo);
            return criterion;
        },
        CalcLookbackDate: function (lookbackDays)
        {
            var retDate = new Date();
            var hrs = retDate.getHours();
            hrs -= (lookbackDays * 24);
            retDate.setHours(hrs);
            return retDate;
        },
        CalcWithinTime: function (dateTime)
        {
            var timeDiff = 0;
            var returnVal = "";
            var today = new Date();
            var one_minute = 1000 * 60;
            var one_hour = one_minute * 60;
            var one_day = one_hour * 24;
            var one_week = one_day * 7;
            var one_month = one_day * (365 / 12);
            var one_year = one_month * 12;

            timeDiff = (today.getTime() - dateTime.getTime()); //time diff in milliseconds
            var valMinutes = Math.ceil(timeDiff / one_minute);
            var valHours = Math.ceil(timeDiff / one_hour);
            var valDays = Math.ceil(timeDiff / one_day);
            var valWeeks = Math.ceil(timeDiff / one_week);
            var valMonths = Math.ceil(timeDiff / one_month);
            var valYears = Math.ceil(timeDiff / one_year);

            if (valHours <= 2)		//Less than 2 hours, display number of minutes. Use abbreviation of "mins". 
                returnVal = (i18n.WITHIN_MINS.replace("{0}", valMinutes));
            else if (valDays <= 2) 	//Less than 2 days, display number of hours. Use abbreviation of "hrs". 
                returnVal = (i18n.WITHIN_HOURS.replace("{0}", valHours));
            else if (valWeeks <= 2)	//Less than 2 weeks, display number of days. Use "days".
                returnVal = (i18n.WITHIN_DAYS.replace("{0}", valDays));
            else if (valMonths <= 2)	//Less than 2 months, display number of weeks. Use abbreviation of "wks".
                returnVal = (i18n.WITHIN_WEEKS.replace("{0}", valWeeks));
            else if (valYears <= 2)	//Less than 2 years, display number of months. Use abbreviation of "mos".
                returnVal = (i18n.WITHIN_MONTHS.replace("{0}", valMonths));
            else 					//Over 2 years, display number of years.  Use abbreviation of "yrs".
                returnVal = (i18n.WITHIN_YEARS.replace("{0}", valYears));

            return (returnVal);
        },
        DisplayDateByOption: function (component, date)
        {
            var dtFormatted = "";
            switch (component.getDateFormat())
            {
                case 1:
                    dtFormatted = date.format("shortDate3");
                    break;
                case 2:
                    dtFormatted = date.format("longDateTime2");
                    break;
                case 3:
                    dtFormatted = MP_Util.CalcWithinTime(date);
                    break;
                case 4:
                    dtFormatted = "&nbsp"; //Display No Date.  Additional logic will need to be applied to hide column.
                    break;
                default:
                    dtFormatted = date.format("longDateTime2");
            }
            return (dtFormatted)
        },
        DisplaySelectedTab: function (showDiv, anchorId)
        {
            if (window.name == "a-tab0")				//first tab is default
                window.name = "";
            else
                window.name = showDiv + ',' + anchorId;
            var body = document.body;
            var divs = Util.Style.g("div-tab-item", body);
            for (var i = divs.length; i--; )
            {
                if (divs[i].id == showDiv)
                {
                    divs[i].style.display = 'block';
                }
                else
                {
                    divs[i].style.display = 'none';
                }
            }

            var anchors = Util.Style.g("anchor-tab-item", body);
            for (var i = anchors.length; i--; )
            {
                if (anchors[i].id == anchorId)
                {
                    anchors[i].className = "anchor-tab-item active";
                }
                else
                {
                    anchors[i].className = "anchor-tab-item inactive";
                }
            }

            //remove initial Customize anchor href
            var custNode = _g("custView");
            if (custNode != null)
            {
                custNode.href = "";
                custNode.innerHTML = "";
            }

            for (var yl = CERN_TabManagers.length; yl--; )
            {
                var tabManager = CERN_TabManagers[yl];
                var tabItem = tabManager.getTabItem();
                if (tabItem.key == showDiv)
                {
                    tabManager.loadTab();
                    tabManager.setSelectedTab(true);
                    var components = tabItem.components;
                    if (components != null && components.length > 0)
                    {
                        for (var xl = components.length; xl--; )
                        {
                            var component = components[xl];
                            MP_Util.Doc.AddCustomizeLink(component.getCriterion());
                            break;
                        }
                    }
                }
                else
                    tabManager.setSelectedTab(false);
            }
        },
        OpenTab: function (compId)
        {
            for (var x = 0, xl = CERN_MPageComponents.length; x < xl; x++)
            {
                var comp = CERN_MPageComponents[x];
                var styles = comp.getStyles();
                if (styles.getId() == compId)
                {
                    comp.openTab();
                }
            }
        },
        LaunchMenuSelection: function (compId, menuItemId)
        {
            //get the exact component from global array
            for (var x = 0, xl = CERN_MPageComponents.length; x < xl; x++)
            {
                var comp = CERN_MPageComponents[x];
                var crit = comp.getCriterion();
                var styles = comp.getStyles();
                if (styles.getId() == compId)
                {
                    comp.openDropDown(menuItemId)
                    break; //found
                }
            }

        },
        LaunchMenu: function (menuId, componentId)
        {
            var menu = _g(menuId);
            MP_Util.closeMenuInit(menu, componentId);
            if (menu != null)
            {
                if (Util.Style.ccss(menu, "menu-hide"))
                {
                    _g(componentId).style.zIndex = 2;
                    Util.Style.rcss(menu, "menu-hide");
                }
                else
                {
                    _g(componentId).style.zIndex = 1; //'doc'
                    Util.Style.acss(menu, "menu-hide");
                }
            }
        },
        closeMenuInit: function (inMenu, compId)
        {
            var menuId;
            var docMenuId = compId + "Menu";
            if (inMenu.id == docMenuId)
            {//m2 'docMenu'
                menuId = compId;
            }
            if (!e)
                var e = window.event;
            if (window.attachEvent)
            {
                Util.addEvent(inMenu, "mouseleave", function ()
                {
                    Util.Style.acss(inMenu, "menu-hide");
                    _g(menuId).style.zIndex = 1;
                });
            }
            else
            {
                Util.addEvent(inMenu, "mouseout", menuLeave);
            }

            menuLeave: function (e)
            {
                if (!e)
                    var e = window.event;
                var relTarg = e.relatedTarget || e.toElement;
                if (e.relatedTarget.id == inMenu.id)
                {
                    Util.Style.acss(inMenu, "menu-hide");
                    _g(menuId).style.zIndex = 1;
                }
                e.stopPropagation();
                Util.cancelBubble(e);
            }
        },
        /**
        * Provies the ability to construct the text that is to be placed after the label of the Component.
        * Each component defines whether or not the number of items within the component should be displayed
        * in the title of the component.  This is a requirements decision and will have to be answered upon creation
        * of the component.  In addition, the lookback units and scope have been moved to the
        * subtitle text line and are no longer necessary in the title text.
        * 
        * The requirement is for each component to define whether or not the contract exists to display a number of items
        * within the component header.  The reason for this contract is when 'no results found' is displayed, the count of zero
        * must be displayed to indicate to the user if there are items within the component.  As for components who do not display
        * a count, the user will still have to manually open the component to determine whether or not data exists.
        * 
        * TODO: The future thought is that in the case of 'no results found' or 'error retrieving data', an additional indicator
        * will be added to the component in some manner to indicate the status.  This is important with components such as Laboratory
        * and Vitals for examples where the count of items is not displayed within the title text.
        * 
        * @param {MPageComponent} component The component in which to add the title text within.
        * @param {Integer} nbr The count of the list items displayed within the component
        * @param {String} optionalText Optional text to allow each consumer to place text within the header of the
        *                 component.
        */
        CreateTitleText: function (component, nbr, optionalText)
        {
            var ar = [];
            if (component.isLineNumberIncluded())
            {
                ar.push("(", nbr, ")");
            }
            if (optionalText && optionalText != "")
            {
                ar.push(" ", optionalText)
            }
            return ar.join("");
        },
        GetContentClass: function (component, nbr)
        {
            if (component.isScrollingEnabled())
            {
                var scrollNbr = component.getScrollNumber();
                if (nbr >= scrollNbr && scrollNbr > 0)
                {
                    return "content-body scrollable";
                }
            }
            return "content-body";
        },
        /**
        * CreateTimer will create a SLA timer and start the timer prior to returning.
        * @param {String} timerName The timer name to start
        * @param {String} subTimerName The subtimer name to start
        * @param {String} metaData1
        * @param {String} metaData2
        * @param {String} metaData3
        */
        CreateTimer: function (timerName, subTimerName, metaData1, metaData2, metaData3)
        {
            try
            {
                var slaTimer = window.external.DiscernObjectFactory("SLATIMER");
            }
            catch (err)
            {
                return null;
            }

            if (slaTimer)
            {
                slaTimer.TimerName = timerName;
                if (subTimerName)
                    slaTimer.SubtimerName = subTimerName;
                if (metaData1)
                    slaTimer.Metadata1 = String(metaData1);
                if (metaData2)
                    slaTimer.Metadata2 = String(metaData2);
                if (metaData3)
                    slaTimer.Metadata3 = String(metaData3);

                slaTimer.Start();
                return slaTimer;
            }
            else
            {
                return null;
            }
        },
        GetCodeSet: function (codeSet, async)
        {
            var codes = new Array();
            var info = new XMLCclRequest();
            info.onreadystatechange = function ()
            {
                if (this.readyState == 4 && this.status == 200)
                {
                    var jsonEval = JSON.parse(this.responseText);
                    if (jsonEval.RECORD_DATA.STATUS_DATA.STATUS == "S")
                    {
                        codes = MP_Util.LoadCodeListJSON(jsonEval.RECORD_DATA.CODES);
                    }
                    return codes;
                }
                if (this.readyState == 4)
                {
                    MP_Util.ReleaseRequestReference(this);
                }

            }
            //  Call the ccl progam and send the parameter string
            info.open('GET', "MP_GET_CODESET", async);
            var sendVal = "^MINE^, " + codeSet + ".0";
            info.send(sendVal);
            return codes;
        },
        GetCodeByMeaning: function (mapCodes, meaning)
        {
            for (var x = mapCodes.length; x--; )
            {
                var code = mapCodes[x].value;
                if (code.meaning == meaning)
                    return code;
            }
        },
        GetItemFromMapArray: function (mapItems, item)
        {
            for (var x = mapItems.length; x--; )
            {
                if (mapItems[x].name == item)
                    return mapItems[x].value;
            }
        },
        /**
        * Add an item to the array of items associated to the map key
        * @param {Object} mapItems The map array to search within
        * @param {Object} key The primary key that will be searching for within the map array
        * @param (Object} value The object that is to be added to the map array
        */
        AddItemToMapArray: function (mapItems, key, value)
        {
            var ar = MP_Util.GetItemFromMapArray(mapItems, key);
            if (ar == null)
            {
                ar = []
                mapItems.push(new MP_Core.MapObject(key, ar));
            }
            ar.push(value);
        },
        LookBackTime: function (component)
        {
            var remainder = 0;
            var lookbackDays = component.getLookbackDays();
            if (lookbackDays == 0)
            {
                return (i18n.SELECTED_VISIT);
            }
            else if (lookbackDays == 1)
                return (i18n.LAST_N_HOURS.replace("{0}", lookbackDays * 24));
            else
                return (i18n.LAST_N_DAYS.replace("{0}", lookbackDays));
        },
        CreateClinNoteLink: function (patient_id, encntr_id, event_id, display, docTypeFlag)
        {
            var docType = (docTypeFlag && docTypeFlag > 0) ? docTypeFlag : 1;
            var doclink = ""
            if (event_id > 0)
            {
                var ar = [];
                ar.push(patient_id, encntr_id, event_id, docType);
                doclink = "<a href=javascript:MP_Util.LaunchClinNoteViewer(" + ar.join(",") + ");>" + display + "</a>"
            }
            else
            {
                doclink = display
            }
            return (doclink);
        },
        /**
        * Retrieves a document for viewing via the MPages RTF viewer
        * @param {Object} eventId The parent or child event id for retrieval
        * @param {Object} docTypeFlag 
        * 0: Parent Event Id retrieval of child event blobs
        * 1: Event Id blob retrieval
        * 2: Long text retrieval
        * 3: Micro Detail retrieval
        * 4: Anatomic Pathology retrieval
        */
        LaunchRTFViewer: function (eventId, docTypeFlag)
        {
            var ar = [];
            ar.push("^mine^", eventId + ".0", docTypeFlag);
            CCLLINK("mp_clin_smry_clinicaldocs", ar.join(","), 1);
        },
        LaunchClinNoteViewer: function (patient_id, encntr_id, event_id, docTypeFlag)
        {
            try
            {
                var sParms = patient_id + "|" + encntr_id + "|" + "[" + event_id + "]|Documents|15|CLINNOTES|3|CLINNOTES|1";
                var tempDate = new Date();
                MPAGES_EVENT('CLINICALNOTE', sParms);
                var tempDate2 = new Date();
                if (tempDate2 - tempDate <= 1000)
                {
                    MP_Util.LaunchRTFViewer(event_id, docTypeFlag);
                }
            }
            catch (err)
            {
                MP_Util.LaunchRTFViewer(event_id, docTypeFlag);
            }

        },
        HandleNoDataResponse: function (nameSpace)
        {
            return ("<h3 class='" + nameSpace + "-info-hd'><span class='res-normal'>" + i18n.NO_RESULTS_FOUND + "</span></h3><span class='res-none'>" + i18n.NO_RESULTS_FOUND + "</span>");
        },
        HandleErrorResponse: function (nameSpace, errorMessage)
        {
            var ar = [];
            ar.push("<h3 class='" + nameSpace + "-info-hd'><span class='res-normal'>" + i18n.ERROR_RETREIVING_DATA + "</span></h3>");
            ar.push("<dl class='" + nameSpace + "-info'><dt><span>" + i18n.ERROR_RETREIVING_DATA + "</span></dt><dd><span>" + i18n.ERROR_RETREIVING_DATA + "</span></dd></dl>");
            //add error in hover if exists
            if (errorMessage != null && errorMessage.length > 0)
            {
                ar.push("<h4 class='", nameSpace, "-det-hd'><span>DETAILS</span></h4><div class='hvr'><dl class='", nameSpace, "-det'><dd><span>", errorMessage, "</span></dd></dl></div>");
            }
            return ar.join("");
        },
        GetValueFromArray: function (name, array)
        {
            if (array != null)
            {
                for (var x = 0, xi = array.length; x < xi; x++)
                {
                    if (array[x].name == name)
                    {
                        return (array[x].value);
                    }
                }
            }
            return (null);
        },
        LoadCodeListJSON: function (parentElement)
        {
            var codeArray = new Array();
            if (parentElement != null)
            {
                for (var x = 0; x < parentElement.length; x++)
                {
                    var codeObject = new Object();
                    codeElement = parentElement[x];
                    codeObject.codeValue = codeElement.CODE;
                    codeObject.display = codeElement.DISPLAY;
                    codeObject.description = codeElement.DESCRIPTION;
                    codeObject.codeSet = codeElement.CODE_SET;
                    codeObject.sequence = codeElement.SEQUENCE;
                    codeObject.meaning = codeElement.MEANING;
                    var mapObj = new MP_Core.MapObject(codeObject.codeValue, codeObject);
                    codeArray.push(mapObj);
                }
            }
            return (codeArray);
        },
        LoadPersonelListJSON: function (parentElement)
        {
            var personnelArray = new Array();
            if (parentElement != null)
            {
                for (var x = 0; x < parentElement.length; x++)
                {
                    var perObject = new Object();
                    codeElement = parentElement[x];
                    perObject.id = codeElement.ID;
                    perObject.fullName = codeElement.PROVIDER_NAME.NAME_FULL;
                    perObject.firstName = codeElement.PROVIDER_NAME.NAME_FIRST;
                    perObject.middleName = codeElement.PROVIDER_NAME.NAME_MIDDLE;
                    perObject.lastName = codeElement.PROVIDER_NAME.NAME_LAST;
                    perObject.userName = codeElement.PROVIDER_NAME.USERNAME;
                    perObject.initials = codeElement.PROVIDER_NAME.INITIALS;
                    perObject.title = codeElement.PROVIDER_NAME.TITLE;
                    var mapObj = new MP_Core.MapObject(perObject.id, perObject);
                    personnelArray[x] = mapObj;
                }
            }
            return (personnelArray);
        },
        WriteToFile: function (sText)
        {
            try
            {
                var ForAppending = 8;
                var TriStateFalse = 0;
                var fso = new ActiveXObject("Scripting.FileSystemObject");
                var newFile = fso.OpenTextFile("c:\\temp\\test.txt", ForAppending, true, TriStateFalse);
                newFile.write(sText);
                newFile.close();
            }
            catch (err)
            {
                var strErr = 'Error:';
                strErr += '\nNumber:' + err.number;
                strErr += '\nDescription:' + err.description;
                document.write(strErr);
            }
        },
        CalculateAge: function (bdate)
        {
            var age;
            var bdate = new Date(bdate); //typecasting string to date obj
            var byear = bdate.getFullYear();
            var bmonth = bdate.getMonth();
            var bday = bdate.getDate();
            var bhours = bdate.getHours();
            today = new Date();
            year = today.getFullYear();
            month = today.getMonth();
            day = today.getDate();
            hours = today.getHours();

            if (year == byear && (day == bday))
            {
                age = hours - bhours;
                age += " Hours";
                return age;
            }
            else if (year == byear && (month == bmonth))
            {
                age = day - bday;
                age += " Days";
                return age;
            }
            if (year == byear)
            {
                age = month - bmonth;
                age += " Months";
                return age;
            }
            else
            {
                if (month < bmonth)
                {
                    age = year - byear - 1;
                }
                else if (month > bmonth)
                {
                    age = year - byear;
                }
                else if (month == bmonth)
                {
                    if (day < bday)
                    {
                        age = year - byear - 1;
                    }
                    else if (day > bday)
                    {
                        age = year - byear;
                    }
                    else if (day == bday)
                    {
                        age = year - byear;
                    }
                }
            }
            age += " Years"
            return age;
        },

        /**
        *  Javascript string pad
        *  http://www.webtoolkit.info/
        **/
        pad: function (str, len, pad, dir)
        {
            if (typeof (len) == "undefined")
            {
                var len = 0;
            }
            if (typeof (pad) == "undefined")
            {
                var pad = ' ';
            }
            if (typeof (dir) == "undefined")
            {
                var dir = STR_PAD_RIGHT;
            }

            if (len + 1 >= str.length)
            {

                switch (dir)
                {

                    case STR_PAD_LEFT:
                        str = Array(len + 1 - str.length).join(pad) + str;
                        break;

                    case STR_PAD_BOTH:
                        var right = Math.ceil((padlen = len - str.length) / 2);
                        var left = padlen - right;
                        str = Array(left + 1).join(pad) + str + Array(right + 1).join(pad);
                        break;

                    default:
                        str = str + Array(len + 1 - str.length).join(pad);
                        break;

                } // switch
            }
            return str;
        },

        /**
        * Launches graph in a modal window viewable in the Powerchart framework
        * @param {float}  patientId
        * @param {float}  encntrId
        * @param {float}  eventCode     : Used to plot simple results for a given patient/encounter I.e. weight,height,BMI,BUN,WBC.
        * @param {string} staticContent : location of the static content directory that contains the core JS / CSS files needed for the graph
        * @param {float}  groupId       : If item is a grouped item pass the BR_DATAMART_FILTER_ID to pull all associated results I.e. BP,Temp,or HR.
        * @param {float}  providerId    : Personel ID of the user
        * @param {float}  positionCd    : Position of the user
        * @param {float}  pprCD         : Person Personell Relationship code value
        * @param {integer}lookBackUnits 
        * @param {integer}lookBackType  : 1 = Hours, 2 = Days, 3 = Weeks, 4 = Months , 5 = Years

        */
        GraphResults: function (personId, encntrId, eventCd, staticContent, groupId, providerId, positionCd, pprCD, lookBackUnits, lookBackType)
        {
            var wParams = "left=0,top=0,width=1200,height=700,toolbar=no";
            var sParams = "^MINE^," + personId + "," + encntrId + "," + eventCd + ",^" + unescape(staticContent) + "^," + groupId + "," + providerId + "," + positionCd + "," + pprCD + "," + lookBackUnits + "," + lookBackType;
            var graphCall = "javascript:CCLLINK('mp_graph_results', '" + sParams + "',1)";
            javascript: CCLNEWSESSIONWINDOW(graphCall, "_self", wParams, 0, 1);
            Util.preventDefault();
        },
        ReleaseRequestReference: function (reqObj)
        {
            //clean up requests
            if (XMLCCLREQUESTOBJECTPOINTER)
            {
                for (var id in XMLCCLREQUESTOBJECTPOINTER)
                {
                    if (XMLCCLREQUESTOBJECTPOINTER[id] == reqObj)
                    {
                        delete (XMLCCLREQUESTOBJECTPOINTER[id])
                    }
                }
            }
        },
        CreateAutoSuggestBoxHtml: function (component)
        {
            var searchBoxHTML = [];
            var compNs = component.getStyles().getNameSpace();
            var compId = component.getComponentId();
            searchBoxHTML.push("<div><form name='contentForm' OnSubmit='return AvoidSubmit();'><input type='text' id='", compNs, "contentCtrl", compId, "'"
					, " class='search-box'></form></div>");
            return searchBoxHTML.join("");
        },
        AddAutoSuggestControl: function (component, queryHandler, selectionHandler, selectDisplayHandler)
        {
            new AutoSuggestControl(component, queryHandler, selectionHandler, selectDisplayHandler);
        },
        RetrieveAutoSuggestSearchBox: function (component)
        {
            var componentNamespace = component.getStyles().getNameSpace();
            var componentId = component.getComponentId();
            return _g(componentNamespace + "contentCtrl" + componentId);
        },
        CreateParamArray: function (ar, type)
        {
            var returnVal = (type === 1) ? "0.0" : "0";
            if (ar && ar.length > 0)
            {
                if (ar.length > 1)
                {
                    if (type === 1)
                    {
                        returnVal = "value(" + ar.join(".0,") + ".0)"
                    }
                    else
                    {
                        returnVal = "value(" + ar.join(",") + ")"
                    }
                }
                else
                {
                    returnVal = (type === 1) ? ar[0] + ".0" : ar[0];
                }
            }
            return returnVal;
        },
        GetSavedXMLData: function (array1)
        {
            var comp = m_savedXML.getElementsByTagName("Visit");
            var savedValue = []; savedData = []; count = 0;
            if (comp.length > 0)
            {
                for (c = 0; c < comp.length; c++)
                {
                    var calcItems = comp[c].getElementsByTagName("CalculatorItems");
                    if (calcItems.length > 0)
                    {
                        savedValue = calcItems[0].firstChild ? calcItems[0].childNodes[0].nodeValue : "";
                    }
                }                
                if (savedValue.length > 0)
                {
                    var array2 = savedValue.split(",");
                    for (var i = 0; i < array2.length; i++)
                    {
                        for (var j = 0; j < array1.length; j++)
                        {
                            if (array2[i] == array1[j])
                            {
                                savedData[count] = array2[i];
                                count++;
                            }
                        }
                    }
                }
            }
            return savedData;
        }
    }
} ();

MP_Util.Doc = function ()
{
    var isExpandedAll = false;
    return {
        /**
        * Initialized the page based on a configuration of multiple MPage objects
        * @param {Array} arMapObjects Array of the MPages to initialize the tab layout.
        * @param {String} title The title to be associated to the page.
        */
        InitMPageTabLayout: function (arMapObjects, title)
        {
            var arItems = [];
            var sc = "", helpFile = "", helpURL = "", debugInd = false;
            var bDisplayBanner = false;
            var criterion = null;
            var custInd = true;
            var anchorArray = null;

            for (var x = 0, xl = arMapObjects.length; x < xl; x++)
            {
                var key = arMapObjects[x].name;
                var page = arMapObjects[x].value;
                criterion = page.getCriterion();
                //arItems.push(new MP_Core.TabItem(key, page.getName(), page.getComponents(), criterion.category_mean))
                sc = criterion.static_content;
                debugInd = criterion.debug_ind;
                helpFile = page.getHelpFileName();
                helpURL = page.getHelpFileURL();
                custInd = page.getCustomizeEnabled();
                anchorArray = page.getTitleAnchors();
                if (page.isBannerEnabled())
                    bDisplayBanner = page.isBannerEnabled();
            }
            MP_Util.Doc.InitTabLayout(arItems, title, sc, helpFile, helpURL, bDisplayBanner, 0, criterion, custInd, anchorArray);
        },
        /**
        * Initialized the page based on a configuration of multiple TabItem objects
        * @param {Array} arTabItems Array of the tab Objects to initialize the tab layout.
        * @param {String} title The title to be associated to the page.
        * @param {String} sc The static content file location.
        * @param {String} helpFile The string name of the help file to associate to the page.
        * @param {String} HelpURL The String name of the help file URL to associate to the page.
        * @param {Boolean} debugInd A boolean indicator denoting if the MPage should be run in debug mode
        */
        InitTabLayout: function (arTabItems, title, sc, helpFile, helpURL, includeBanner, debugInd, criterion, custInd, anchorArray)
        {
            var body = document.body;
            //create page title
            MP_Util.Doc.AddPageTitle(title, body, debugInd, custInd, anchorArray);

            //create help file link
            if (helpFile != null && helpFile.length > 0)
                MP_Util.Doc.AddHelpLink(sc, helpFile);
            else if (helpURL != null && helpURL.length > 0)
                MP_Util.Doc.AddHelpURL(sc, helpURL);

            //check if banner should be created
            if (includeBanner)
            {
                body.innerHTML += "<div id=banner></div>";
            }
            body.innerHTML += "<div id='disclaimer'><span>" + i18n.DISCLAIMER + "</span></div>";

            //create unordered list for page level tabs
            //  a) need the id of the tabs to identify, b) the name of the tab, c) the components to add
            AddPageTabs(arTabItems, body);

            //create component placeholders for each tab
            CERN_TabManagers = [];
            for (var x = 0, xl = arTabItems.length; x < xl; x++)
            {
                var tabItem = arTabItems[x];
                var tabManager = new MP_Core.TabManager(tabItem);
                if (x == 0)
                {
                    //the first tab will be selected upon initial loading of page.
                    tabManager.setSelectedTab(true);
                }
                CERN_TabManagers.push(tabManager);
                CreateLiquidLayout(tabItem.components, _g(arTabItems[x].key));
            }
            MP_Util.Doc.AddCustomizeLink(criterion);
            SetupExpandCollapse();
        },
        InitLayout: function (mPage)
        {
            var body = document.body;
            var criterion = mPage.getCriterion();
            //create page title
            MP_Util.Doc.AddPageTitle(mPage.getName(), body, criterion.debug_ind, mPage.getCustomizeEnabled(), mPage.getTitleAnchors());

            //create help file link
            var sc = criterion.static_content;
            var helpFile = mPage.getHelpFileName();
            var helpURL = mPage.getHelpFileURL();
            if (helpFile != null && helpFile.length > 0)
                MP_Util.Doc.AddHelpLink(sc, helpFile);
            else if (helpURL != null && helpURL.length > 0)
                MP_Util.Doc.AddHelpURL(sc, helpURL);

            //check if banner should be created
            if (mPage.isBannerEnabled())
            {
                body.innerHTML += "<div id=banner></div>";
            }
            body.innerHTML += "<div id='disclaimer'><span>" + i18n.DISCLAIMER + "</span></div>";

            //CreateLiquidLayout(mPage.getComponents(), body)
            MP_Util.Doc.AddCustomizeLink(criterion);
            SetupExpandCollapse();
        },
        InitLayoutComponentWizard: function (mPage)
        {
            var tHTML = "";
            var criterion = mPage.getCriterion();
            CERN_WizardComponents = [];
            CERN_WizardComponents.push(mPage.getComponents());
            tHTML = CreateLiquidLayoutComponent(mPage.getComponents(), tHTML);
            MP_Util.Doc.AddCustomizeLink(criterion);
            return (tHTML);
        },
        SetupExpandCollapseWizard: function (mPage)
        {
            SetupExpandCollapse();
        },
        CustomizeLayout: function (title, components)
        {
            var body = document.body;
            MP_Util.Doc.AddPageTitle(title, body, 0, false, null);
            MP_Util.Doc.AddClearPreferences(body)
            MP_Util.Doc.AddSavePreferences(body)

            body.innerHTML += "<div id='disclaimer'><span>" + i18n.USER_CUST_DISCLAIMER + "</span></div>";

            var compAr = [];
            for (var x = components.length; x--; )
            {
                var component = components[x];
                if (component.getColumn() != 99)
                    compAr.push(component);
            }

            CreateCustomizeLiquidLayout(compAr, body)
            SetupExpandCollapse();
        },
        GetComments: function (par, personnelArray)
        {
            var com = "", recDate = "";
            var dateTime = new Date();
            for (var j = 0, m = par.COMMENTS.length; j < m; j++)
            {
                if (personnelArray.length != null)
                {
                    if (par.COMMENTS[j].RECORDED_BY)
                        perCodeObj = MP_Util.GetValueFromArray(par.COMMENTS[j].RECORDED_BY, personnelArray);

                    if (par.COMMENTS[j].RECORDED_DT_TM != "")
                    {
                        recDate = par.COMMENTS[j].RECORDED_DT_TM;
                        dateTime.setISO8601(recDate);
                        recDate = dateTime.format("longDateTime3");
                    }
                    if (j > 0)
                    {
                        com += "<br />";
                    }
                    com += recDate + " -  " + perCodeObj.fullName + "<br />" + par.COMMENTS[j].COMMENT_TEXT;
                }
            }
            return com;
        },
        FinalizeComponent: function (contentHTML, component, countText)
        {
            var styles = component.getStyles();
            //replace counte text
            var rootComponentNode = component.getRootComponentNode();
            var totalCount = Util.Style.g("sec-total", rootComponentNode, "span");
            totalCount[0].innerHTML = countText;

            //replace content with HTML
            var node = component.getSectionContentNode();
            node.innerHTML = contentHTML;

            //init hovers
            MP_Util.Doc.InitHovers(styles.getInfo(), node);

            //init subsection toggles
            if (!component.isRefTxtExpanded())
            {
                var style = component.getStyles().getNameSpace();
                var oClass = "fc-sub-sec " + style;
                var nClass = "fc-sub-sec " + style + " closed";
                $("#fc-sub-sec-" + style).removeClass(oClass).addClass(nClass);
            }
            MP_Util.Doc.InitSubToggles(node, "fc-sub-sec-hd-tgl");
            MP_Util.Doc.InitSubToggles(node, "sub-sec-hd-tgl");
            //init scrolling
            MP_Util.Doc.InitScrolling(Util.Style.g("scrollable", node, "div"), component.getScrollNumber(), "1.6")
        },
        /**
        * Formats the content to the appropriate height and enables scrolling
        * @param {node} content : The content to be formatted
        * @param {int} num : The approximate number of items to display face up
        * @param {float} ht : The total line height of an item
        */
        InitScrolling: function (content, num, ht)
        {
            for (var k = 0; k < content.length; k++)
            {
                MP_Util.Doc.InitSectionScrolling(content[k], num, ht);
            }
        },
        /**
        * Formats the section to the appropriate height and enables scrolling
        * @param {node} sec : The section to be formatted
        * @param {int} num : The approximate number of items to display face up
        * @param {float} ht : The total line height of an item
        */
        InitSectionScrolling: function (sec, num, ht)
        {
            var th = num * ht
            var totalHeight = th + "em";
            sec.style.height = totalHeight;
            sec.style.overflowY = 'scroll';
            sec.style.overflowX = 'hidden';
        },
        InitHovers: function (trg, par)
        {
            gen = Util.Style.g(trg, par, "DL")

            for (var i = 0, l = gen.length; i < l; i++)
            {
                var m = gen[i];
                if (m)
                {
                    var nm = Util.gns(Util.gns(m));
                    if (nm)
                    {
                        if (Util.Style.ccss(nm, "hvr"))
                        {
                            hs(m, nm);
                        }
                    }
                }
            }
        },
        InitSubToggles: function (par, tog)
        {
            var toggleArray = Util.Style.g(tog, par, "span");
            for (var k = 0; k < toggleArray.length; k++)
            {
                Util.addEvent(toggleArray[k], "click", MP_Util.Doc.ExpandCollapse);
                var checkClosed = Util.gp(Util.gp(toggleArray[k]));
                if (Util.Style.ccss(checkClosed, "closed"))
                {
                    toggleArray[k].innerHTML = "+";
                    toggleArray[k].title = i18n.SHOW_SECTION;
                }
            }
        },
        ExpandCollapseAll: function ()
        {
            var allSections = Util.Style.g("section");
            var expNode = _g("expAll")
            if (isExpandedAll)
            {
                for (var i = 0, asLen = allSections.length; i < asLen; i++)
                {
                    var secHandle = Util.gc(Util.gc(allSections[i]));
                    if (secHandle.innerHTML == "-" || secHandle.innerHTML == "+")
                    {
                        Util.Style.acss(allSections[i], "closed");
                        secHandle.innerHTML = "+";
                        secHandle.title = i18n.SHOW_SECTION;
                    }
                    else
                    {
                        var allSubSections = Util.Style.g("sub-sec", allSections[i], "div");
                        for (var j = 0, aSubLen = allSubSections.length; j < aSubLen; j++)
                        {
                            var subSecTgl = Util.gc(Util.gc(allSubSections[j]));
                            Util.Style.acss(allSubSections[j], "closed");
                            subSecTgl.innerHTML = "+";
                            subSecTgl.title = i18n.SHOW_SECTION;
                        }
                    }
                    expNode.innerHTML = i18n.EXPAND_ALL;
                }
                isExpandedAll = false;
            }
            else
            {
                for (var i = 0, asLen = allSections.length; i < asLen; i++)
                {
                    var secHandle = Util.gc(Util.gc(allSections[i]));
                    if (secHandle.innerHTML == "-" || secHandle.innerHTML == "+")
                    {
                        Util.Style.rcss(allSections[i], "closed");
                        secHandle.innerHTML = "-";
                        secHandle.title = i18n.HIDE_SECTION;
                    }
                    else
                    {
                        var allSubSections = Util.Style.g("sub-sec", allSections[i], "div");
                        for (var j = 0, aSubLen = allSubSections.length; j < aSubLen; j++)
                        {
                            var subSecTgl = Util.gc(Util.gc(allSubSections[j]));
                            Util.Style.rcss(allSubSections[j], "closed");
                            subSecTgl.innerHTML = "-";
                            subSecTgl.title = i18n.HIDE_SECTION;
                        }
                    }
                    expNode.innerHTML = i18n.COLLAPSE_ALL;
                }
                isExpandedAll = true;
            }

        },

        ExpandSubSectionCollapseAll: function ()
        {
            var allSections = Util.Style.g("section");
            var expNode = _g("expandSub")
            if (expNode.innerHTML == i18n.COLLAPSE_SUB_SEC)
            {
                for (var i = 0, asLen = allSections.length; i < asLen; i++)
                {

                    var allSubSections = Util.Style.g("fc-sub-sec", allSections[i], "div");
                    for (var j = 0, aSubLen = allSubSections.length; j < aSubLen; j++)
                    {


                        var subSecTgl = Util.gc(Util.gc(allSubSections[j]));
                        Util.Style.acss(allSubSections[j], "closed");
                        subSecTgl.innerHTML = "+";
                        subSecTgl.title = i18n.SHOW_SECTION;
                    }

                    expNode.innerHTML = i18n.EXPAND_SUB_SEC;
                }
            }
            else
            {
                for (var i = 0, asLen = allSections.length; i < asLen; i++)
                {
                    var secHandle = Util.gc(Util.gc(allSections[i]));

                    var allSubSections = Util.Style.g("fc-sub-sec", allSections[i], "div");
                    for (var j = 0, aSubLen = allSubSections.length; j < aSubLen; j++)
                    {
                        var subSecTgl = Util.gc(Util.gc(allSubSections[j]));
                        Util.Style.rcss(allSubSections[j], "closed");
                        subSecTgl.innerHTML = "-";
                        subSecTgl.title = i18n.HIDE_SECTION;
                    }

                    expNode.innerHTML = i18n.COLLAPSE_SUB_SEC;
                }
            }

        },
        /**
        * Adds the title to the page.
        * @param {String} title The title of the page to display
        * @param {Object} bodyTag The body tag associated to the HTML document
        * @param {Boolean} debugInd Indicator denoting if the mpage should run in debug mode.
        * @param {Boolean} custInd Indicator denoting if the 'customize' option should be made available to the user for the given layout
        */
        AddPageTitle: function (title, bodyTag, debugInd, custInd, anchorArray)
        {
            var ar = [];
            if (bodyTag == null)
                bodyTag = document.body;
            ar.push("<div class='pg-hd'>");
            ar.push("<h1><span class=pg-title>", title, "</span></h1><span id=pageCtrl class=page-ctrl>");
            //add optional anchors
            if (anchorArray != null)
            {
                for (var x = 0, xl = anchorArray.length; x < xl; x++)
                {
                    ar.push(anchorArray[x]);
                }
            }
            ar.push("<a id=expAll onclick='javascript:MP_Util.Doc.ExpandCollapseAll()'>",
				i18n.EXPAND_ALL, "</a>")
            if (custInd)
                ar.push("<a id=custView></a>");
            ar.push("<a id=helpMenu></a></span></div>");
            bodyTag.innerHTML += ar.join("");
            return;
        },
        AddHelpLink: function (staticContent, helpFile)
        {
            if (helpFile != null && helpFile != "")
            {
                var helpNode = _g("helpMenu");
                helpNode.href = staticContent + "\\html\\" + helpFile;
                helpNode.innerHTML = i18n.HELP;
                var imageNode = Util.cep("IMG", { "src": staticContent + "\\images\\3865_16.gif" });
                Util.ia(imageNode, helpNode);
            }
        },
        AddHelpURL: function (staticContent, url)
        {
            if (url != null && url != "")
            {
                var helpNode = _g("helpMenu");
                helpNode.href = url;
                helpNode.innerHTML = i18n.HELP;
                var imageNode = Util.cep("IMG", { "src": staticContent + "\\images\\3865_16.gif" });
                Util.ia(imageNode, helpNode);
            }
        },
        AddClearPreferences: function (body)
        {
            var pageCtrl = _g("pageCtrl");
            var clearPrefNode = Util.cep("A", { "id": "clearPrefs", "onclick": "javascript:MP_Core.AppUserPreferenceManager.ClearPreferences();" });
            clearPrefNode.innerHTML = i18n.CLEAR_PREFERENCES;
            Util.ac(clearPrefNode, pageCtrl)
        },
        AddSavePreferences: function (body)
        {
            var pageCtrl = _g("pageCtrl");
            var savePrefNode = Util.cep("A", { "id": "savePrefs", "onclick": "javascript:MP_Core.AppUserPreferenceManager.SavePreferences();" });
            savePrefNode.innerHTML = i18n.SAVE_PREFERENCES;
            Util.ac(savePrefNode, pageCtrl)
        },
        AddCustomizeLink: function (criterion)
        {
            var custNode = _g("custView");
            if (custNode != null)
            {
                custNode.innerHTML = i18n.CUSTOMIZE;
                var compReportIds = GetPageReportIds();
                custNode.href = criterion.static_content + "\\js\\cust\\mp_user_cust.html?personnelId=" + criterion.provider_id + "&positionCd=" + criterion.position_cd + "&categoryMean=" + GetPreferenceIdentifier();
                custNode.href += (compReportIds.length > 0) ? "&reportIds=" + compReportIds.join(",") : "";

            }
        },
        /**
        * Allows the consumer of the architecture to render the components that exist either on the tab layout
        * or the single driving MPage.  For tab based pages, the first tab is loaded by default.
        */
        RenderLayout: function ()
        {
            // Return to tab being viewed upon refresh - CERTRN
            if (CERN_TabManagers != null)
            {
                var tabManager = null;
                if (window.name.length > 0)
                {
                    var paramList = window.name.split(",");
                    MP_Util.DisplaySelectedTab(paramList[0], paramList[1]);
                }
                else
                {
                    tabManager = CERN_TabManagers[0];
                    tabManager.setSelectedTab(true);
                    tabManager.loadTab();
                }
            }
            else if (CERN_MPageComponents != null)
            {
                for (var x = CERN_MPageComponents.length; x--; )
                {
                    var comp = CERN_MPageComponents[x];
                    if (comp.isDisplayable())
                        comp.InsertData();
                }
            }
        },
        ExpandCollapse: function ()
        {
            var gpp = Util.gp(Util.gp(this));
            if (Util.Style.ccss(gpp, "closed"))
            {
                Util.Style.rcss(gpp, "closed");
                this.innerHTML = "-";
                this.title = i18n.HIDE_SECTION;
            }
            else
            {
                Util.Style.acss(gpp, "closed");
                this.innerHTML = "+";
                this.title = i18n.SHOW_SECTION;
            }
        },
        DitherComponents: function ()
        {
            var components = m_Mpage.getComponents();
            var comLen = components.length;
            for (var y = 0, yl = comLen; y < yl; y++)
            {
                if (!(components[y] instanceof VisitTypesComponent))
                {
                    var compId = components[y].getStyles().getId();
                    if (_g(compId))
                    {
                        _g(compId).style.display = "none";
                        $('#wz-hdr').hide();
                        m_dispEMCompInd = false;
                    }
                }
            }
        },
        EnableComponents: function ()
        {
            var components = m_Mpage.getComponents();
            var comLen = components.length;
            for (var y = 0, yl = comLen; y < yl; y++)
            {
                if (!(components[y] instanceof VisitTypesComponent))
                {
                    var compId = components[y].getStyles().getId();
                    if (_g(compId))
                    {
                        _g(compId).style.display = "block";
                        $('#wz-hdr').show();
                        m_dispEMCompInd = true;
                    }
                }
            }
        }
    };
    function GetPreferenceIdentifier()
    {
        var prefIdentifier = "";
        if (CERN_TabManagers != null)
        {
            for (var x = CERN_TabManagers.length; x--; )
            {
                var tabManager = CERN_TabManagers[x];
                if (tabManager.getSelectedTab())
                {
                    var tabItem = tabManager.getTabItem();
                    return tabItem.prefIdentifier;
                }
            }
        }
        else if (CERN_MPageComponents != null)
        {
            for (var x = CERN_MPageComponents.length; x--; )
            {
                var criterion = CERN_MPageComponents[x].getCriterion();
                return criterion.category_mean;
            }
        } else if (CERN_WizardComponents != null)
        {
            for (var x = CERN_WizardComponents.length; x--; )
            {
                var criterion = CERN_WizardComponents[x].getCriterion();
                return criterion.category_mean;
            }
        }
        return prefIdentifier;
    }
    function GetPageReportIds()
    {
        var ar = [];
        if (CERN_TabManagers != null)
        {
            for (var x = CERN_TabManagers.length; x--; )
            {
                var tabManager = CERN_TabManagers[x];
                if (tabManager.getSelectedTab())
                {
                    var tabItem = tabManager.getTabItem();
                    var components = tabItem.components;
                    if (components != null && components.length > 0)
                    {
                        for (var y = components.length; y--; )
                        {
                            ar.push(components[y].getReportId())
                        }
                    }
                    break;
                }
            }
        }
        else if (CERN_MPageComponents != null)
        {
            for (var x = CERN_MPageComponents.length; x--; )
            {
                ar.push(CERN_MPageComponents[x].getReportId());
            }
        }
        return ar;
    }

    function GetComponentArray(components)
    {
        var grpAr = [];
        var colAr = [];
        var rowAr = [];
        var curCol = -1;
        var curGrp = -1;

        var sHTML = [];

        //first layout the group/columns/rows of components
        if (components != null)
        {
            components.sort(SortMPageComponents);

            for (var x = 0, xl = components.length; x < xl; x++)
            {
                var component = components[x];
                if (CERN_MPageComponents == null)
                    CERN_MPageComponents = [];
                CERN_MPageComponents.push(component);

                if (component.isDisplayable())
                { //based on filter logic, only display if criteria is met
                    var compGrp = component.getPageGroupSequence();
                    var compCol = component.getColumn();

                    if (compGrp != curGrp)
                    {
                        curCol = -1;
                        colAr = [];
                        grpAr.push(colAr);
                        curGrp = compGrp;
                    }

                    if (compCol != curCol)
                    {
                        rowAr = [];
                        colAr.push(rowAr);
                        curCol = compCol;
                    }
                    rowAr.push(component);
                }
            }
        }
        return grpAr;
    }
    function CreateCustomizeLiquidLayout(components, parentNode)
    {
        var sHTML = [];
        var grpAr = GetComponentArray(components);
        sHTML.push("<div class=pref-columns>");
        for (var x = 0, xl = grpAr.length; x < xl; x++)
        {
            colAr = grpAr[x];
            sHTML.push("<div>");
            var colLen = colAr.length;
            sHTML.push("<div class='col-group three-col'>"); //always allow for a 3 column custimization
            sHTML.push("<div class='col-outer2'><div class='col-outer1'>");

            for (var y = 0; y < colLen; y++)
            {
                var comps = colAr[y];
                var colClassName = "col" + (y + 1) + " cust-col";
                sHTML.push("<div class='", colClassName, "'>")
                for (var z = 0, zl = comps.length; z < zl; z++)
                {
                    sHTML.push(CreateCompDiv(comps[z]));
                }
                sHTML.push("</div>");
            }
            for (var y = colLen + 1; y <= 3; y++)
            {
                var colClassName = "col" + (y) + " cust-col";
                sHTML.push("<div class='", colClassName, "'></div>")
            }
            sHTML.push("</div></div></div></div>");
        }
        sHTML.push("</div>");
        parentNode.innerHTML += sHTML.join("");
    }

    function CreateLiquidLayout(components, parentNode)
    {
        var grpAr = GetComponentArray(components);
        var sHTML = [];

        for (var x = 0, xl = grpAr.length; x < xl; x++)
        {
            colAr = grpAr[x];
            sHTML.push("<div>");
            var colLen = colAr.length;
            if (colLen == 1)
                sHTML.push("<div class='col-group one-col'>");
            else if (colLen == 2)
                sHTML.push("<div class='col-group two-col'>");
            else
                sHTML.push("<div class='col-group three-col'>");

            sHTML.push("<div class='col-outer2'><div class='col-outer1'>");

            for (var y = 0; y < colLen; y++)
            {
                var colClassName = "col" + (y + 1);
                var comps = colAr[y];
                sHTML.push("<div class='", colClassName, "'>")
                for (var z = 0, zl = comps.length; z < zl; z++)
                {
                    sHTML.push(CreateCompDiv(comps[z]));
                }
                sHTML.push("</div>");
            }
            sHTML.push("</div></div></div></div>");
        }
        parentNode.innerHTML += sHTML.join("");
    }
    function CreateLiquidLayoutComponent(components, parentNode)
    {
        var grpAr = GetComponentArray(components);
        var sHTML = [];

        for (var x = 0, xl = grpAr.length; x < xl; x++)
        {
            colAr = grpAr[x];
            sHTML.push("<div>");
            var colLen = colAr.length;
            if (colLen == 1)
                sHTML.push("<div class='col-group one-col'>");
            else if (colLen == 2)
                sHTML.push("<div class='col-group two-col'>");
            else
                sHTML.push("<div class='col-group three-col'>");

            sHTML.push("<div class='col-outer2'><div class='col-outer1'>");

            for (var y = 0; y < colLen; y++)
            {
                var colClassName = "col" + (y + 1);
                var comps = colAr[y];
                sHTML.push("<div class='", colClassName, "'>")
                for (var z = 0, zl = comps.length; z < zl; z++)
                {
                    sHTML.push(CreateCompDiv(comps[z]));
                }
                sHTML.push("</div>");
            }
            sHTML.push("</div></div></div></div>");
        }
        //parentNode.innerHTML += sHTML.join("");
        return (sHTML.join(""));
    }
    function SetupExpandCollapse()
    {
        //set up expand collapse for all components
        var toggleArray = Util.Style.g("sec-hd-tgl");
        for (var k = 0; k < toggleArray.length; k++)
        {
            Util.addEvent(toggleArray[k], "click", MP_Util.Doc.ExpandCollapse);
            var checkClosed = Util.gp(Util.gp(toggleArray[k]));
            if (Util.Style.ccss(checkClosed, "closed"))
            {
                toggleArray[k].innerHTML = "+";
                toggleArray[k].title = i18n.SHOW_SECTION;
            }
        }
    }

    function CreateCompDiv(component)
    {
        var ar = [];
        var style = component.getStyles();
        var ns = style.getNameSpace();
        var compId = style.getId();
        var secClass = style.getClassName();
        var tabLink = component.getLink();
        var loc = component.getCriterion().static_content;
        var tglCode = (!component.isAlwaysExpanded()) ? ["<span class='", style.getHeaderToggle(), "' title='", i18n.HIDE_SECTION, "'>-</span>"].join("") : "";

        if (!component.isExpanded() && !component.isAlwaysExpanded())
            secClass += " closed";

        if (component.isDisplayable())
        {
            if (m_dispEMCompInd || component.getDisplay())
            {
                secClass += " comp-display";
            }
            else
            {
                secClass += " comp-hide";
            }
        }

        var sAnchor = (tabLink != "" && component.getCustomizeView() == false) ? CreateComponentAnchor(component) : component.getLabel();
        ar.push("<div id='", style.getId(), "' class='", secClass, "'>", "<h2 class='", style.getHeaderClass(), "'>",
			tglCode, "<span class='", style.getTitle(), "'><span>",
			sAnchor, "</span>");
        if (component.getCustomizeView() == false)
        {
            ar.push("<span class='", style.getTotal(), "'>", i18n.LOADING_DATA + "...", "</span>");
            if (component.isPlusAddEnabled())
            {
                ar.push("<a id='", ns, "Add' class=addPlus href=javascript:MP_Util.OpenTab('", compId, "');><img src='", loc, "\\images\\3941.gif'>", i18n.ADD, "</a>")
                var menuItems = component.getMenuItems();
                if (menuItems != null || menuItems > 0)
                {
                    var menuId = compId + "Menu";
                    ar.push("<a id='", ns, "Drop' class='drop-Down'><img src='", loc, "\\images\\3943_16.gif' onclick='javascript:MP_Util.LaunchMenu(\"", menuId, "\", \"", compId, "\");'></a>")
                    ar.push("<div class='form-menu menu-hide' id='", menuId, "'><span>")
                    for (var x = 0, xl = menuItems.length; x < xl; x++)
                    {
                        var item = menuItems[x];
                        ar.push("<div>")
                        ar.push("<a id='lnkID", x, "' href='#' onclick='javascript:MP_Util.LaunchMenuSelection(\"", compId, '\",', item.getId(), ");'>", item.getDescription(), "</a>")
                        ar.push("</div>")
                    }

                    ar.push("</span></div>")
                }


            }
        }
        ar.push("</span></h2>")
        if (component.getCustomizeView() == false)
        {
            if (component.getScope() > 0)
                ar.push("<div class=sub-title-disp>", CreateSubTitleText(component), "</div>");
        }
        ar.push("<div id='", style.getContentId(), "' class='", style.getContentClass(), "'></div></div>")
        var arHtml = ar.join("");
        return arHtml;
    }

    function CreateSubTitleText(component)
    {
        var subTitleText = "";
        var scope = component.getScope();
        var lookbackDays = component.getLookbackDays();
        var lookbackUnits = (lookbackDays > 0) ? lookbackDays : component.getLookbackUnits();
        var lookbackFlag = (lookbackDays > 0) ? 2 : component.getLookbackUnitTypeFlag();

        if (scope > 0)
        {
            if (lookbackFlag > 0 && lookbackUnits > 0)
            {
                var replaceText = "";
                switch (lookbackFlag)
                {
                    case 1: replaceText = i18n.LAST_N_HOURS.replace("{0}", lookbackUnits); break;
                    case 2: replaceText = i18n.LAST_N_DAYS.replace("{0}", lookbackUnits); break;
                    case 3: replaceText = i18n.LAST_N_WEEKS.replace("{0}", lookbackUnits); break;
                    case 4: replaceText = i18n.LAST_N_MONTHS.replace("{0}", lookbackUnits); break;
                    case 5: replaceText = i18n.LAST_N_YEARS.replace("{0}", lookbackUnits); break;
                }

                switch (scope)
                {
                    case 1: subTitleText = i18n.ALL_N_VISITS.replace("{0}", replaceText); break;
                    case 2: subTitleText = i18n.SELECTED_N_VISIT.replace("{0}", replaceText); break;
                }

            }
            else
            {
                switch (scope)
                {
                    case 1: subTitleText = i18n.All_VISITS; break;
                    case 2: subTitleText = i18n.SELECTED_VISIT; break;
                }
            }
        }
        return subTitleText;
    }

    function CreateComponentAnchor(component)
    {
        var style = component.getStyles();
        var criterion = component.getCriterion();
        var sParms = 'javascript:APPLINK(0,"' + criterion.executable + '","/PERSONID=' + criterion.person_id + ' /ENCNTRID=' + criterion.encntr_id + ' /FIRSTTAB=^' + component.getLink() + '^")';
        var sAnchor = "<a id=" + style.getLink() + " title='" + i18n.GO_TO_TAB.replace("{0}", component.getLink()) + "' href='" + sParms + "'>" + component.getLabel() + "</a>";
        return sAnchor;
    }
    function AddPageTabs(items, bodyTag)
    {
        var ar = [];
        var divAr = [];
        if (bodyTag == null)
            bodyTag = document.body;
        //first create unordered list for page level tabs
        ar.push("<ul class=tabmenu>")
        for (var x = 0, xl = items.length; x < xl; x++)
        {
            var item = items[x];
            var activeInd = (x == 0) ? 1 : 0;
            ar.push(CreateTabLi(item, activeInd, x))
            divAr.push("<div id='", item.key, "' class='div-tab-item'></div>");
        }
        ar.push("</ul>")
        bodyTag.innerHTML += (ar.join("") + divAr.join(""));
    }
    function CreateTabLi(item, activeInd, sequence)
    {
        var ar = [];
        var tabName = "";
        tabName = item.name;
        ar.push("<li>")
        var seqClass = "a-tab" + sequence;
        if (activeInd)
            ar.push("<a id='", seqClass, "' class='anchor-tab-item active' href='javascript:MP_Util.DisplaySelectedTab(\"", item.key, "\",\"", seqClass, "\");'>", tabName, "</a>");
        else
            ar.push("<a id='", seqClass, "' class='anchor-tab-item inactive' href='javascript:MP_Util.DisplaySelectedTab(\"", item.key, "\",\"", seqClass, "\");'>", tabName, "</a>");
        ar.push("</li>")
        return (ar.join(""));
    }
} ();


MP_Util.Measurement = function ()
{
    return {
        GetString: function (result, codeArray, dateMask)
        {
            var obj = MP_Util.Measurement.GetObject(result, codeArray);
            if (obj instanceof MP_Core.QuantityValue)
                return obj.toString();
            else if (obj instanceof Date)
                return obj.format(dateMask);
            else
                return obj;
        },
        GetObject: function (result, codeArray)
        {
            switch (result.CLASSIFICATION.toUpperCase())
            {
                case "QUANTITY_VALUE":
                    return GetQuantityValue(result, codeArray);
                case "STRING_VALUE":
                    return (GetStringValue(result));
                case "DATE_VALUE": //we are curently not returning any date_value results. a common method shall be implemented if/when necessary
                    return (GetDateValue(result));
                case "CODE_VALUE":
                    return (GetCodedResult(result));
                case "ENCAPSULATED_VALUE":
                    return (GetEncapsulatedValue(result));
            }
        },
        SetPrecision: function (num, dec)
        {
            return num.toFixed(dec);
        }
    };
    function GetEncapsulatedValue(result)
    {
        var encap = result.ENCAPSULATED_VALUE;
        var ar = [];
        for (var n = 0, nl = encap.length; n < nl; n++)
        {
            var txt = encap[n].TEXT_PLAIN;
            if (txt != null && txt.length > 0)
                ar.push(txt);
        }
        return ar.join("");
    }
    function GetQuantityValue(result, codeArray)
    {
        var qv = new MP_Core.QuantityValue();
        qv.init(result, codeArray);
        return qv;
    }
    function GetDateValue(result)
    {
        for (var x = 0, xl = result.DATE_VALUE.length; x < xl; x++)
        {
            var date = result.DATE_VALUE[x];
            if (date.DATE != "")
            {
                var dateTime = new Date();
                dateTime.setISO8601(date.DATE);
                return dateTime;
            }
        }
        return null;
    }
    function GetCodedResult(result)
    {
        var cdValue = result.CODE_VALUE;
        var ar = [];
        for (var n = 0, nl = cdValue.length; n < nl; n++)
        {
            var values = cdValue[n].VALUES;
            for (var p = 0, pl = values.length; p < pl; p++)
            {
                ar.push(values[p].SOURCE_STRING)
            }
            var sOther = cdValue[n].OTHER_RESPONSE;
            if (sOther != "")
                ar.push(sOther)
        }
        return ar.join(", ");
    }
    function GetStringValue(result)
    {
        var strValue = result.STRING_VALUE;
        var ar = [];
        for (var n = 0, nl = strValue.length; n < nl; n++)
        {
            ar.push(strValue[n].VALUE);
        }
        return ar.join(", ");
    }
} ();
/**
* Returns an array of elements with the designated classname.
* @param {Object} cl The CSS classname.
* @param {Object} e The parent element to search within, defaults to document.
* @return {Array} Returns an array of elements with the designated classname.
* @deprecated
*/
document.getElementsByClassName = function (cl, e)
{
    var retnode = [];
    var clssnm = new RegExp('\\b' + cl + '\\b');
    var elem = this.getElementsByTagName('*', e);
    for (var u = 0; u < elem.length; u++)
    {
        var classes = elem[u].className;
        if (clssnm.test(classes)) retnode.push(elem[u]);
    }
    return retnode;
};