var dateFormat=function(){var token=/d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,timezone=/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,timezoneClip=/[^-+\dA-Z]/g,pad=function(val,len){val=String(val);
len=len||2;
while(val.length<len){val="0"+val;
}return val;
};
return function(date,mask,utc){var dF=dateFormat;
if(arguments.length==1&&Object.prototype.toString.call(date)=="[object String]"&&!/\d/.test(date)){mask=date;
date=undefined;
}date=date?new Date(date):new Date;
if(isNaN(date)){throw SyntaxError("invalid date");
}mask=String(dF.masks[mask]||mask||dF.masks["default"]);
if(mask.slice(0,4)=="UTC:"){mask=mask.slice(4);
utc=true;
}var _=utc?"getUTC":"get",d=date[_+"Date"](),D=date[_+"Day"](),m=date[_+"Month"](),y=date[_+"FullYear"](),H=date[_+"Hours"](),M=date[_+"Minutes"](),s=date[_+"Seconds"](),L=date[_+"Milliseconds"](),o=utc?0:date.getTimezoneOffset(),flags={d:d,dd:pad(d),ddd:dF.i18n.dayNames[D],dddd:dF.i18n.dayNames[D+7],m:m+1,mm:pad(m+1),mmm:dF.i18n.monthNames[m],mmmm:dF.i18n.monthNames[m+12],yy:String(y).slice(2),yyyy:y,h:H%12||12,hh:pad(H%12||12),H:H,HH:pad(H),M:M,MM:pad(M),s:s,ss:pad(s),l:pad(L,3),L:pad(L>99?Math.round(L/10):L),t:H<12?"a":"p",tt:H<12?"am":"pm",T:H<12?"A":"P",TT:H<12?"AM":"PM",Z:utc?"UTC":(String(date).match(timezone)||[""]).pop().replace(timezoneClip,""),o:(o>0?"-":"+")+pad(Math.floor(Math.abs(o)/60)*100+Math.abs(o)%60,4),S:["th","st","nd","rd"][d%10>3?0:(d%100-d%10!=10)*d%10]};
return mask.replace(token,function($0){return $0 in flags?flags[$0]:$0.slice(1,$0.length-1);
});
};
}();
dateFormat.masks={"default":"ddd mmm dd yyyy HH:MM:ss",shortDate:"dd/m/yy",shortDate2:"dd/mm/yyyy",shortDate3:"dd/mm/yy",shortDate4:"mm/yyyy",shortDate5:"yyyy",mediumDate:"d mmm, yyyy",longDate:"d mmmm, yyyy",fullDate:"dddd, d mmmm, yyyy",shortTime:"HH:MM",mediumTime:"HH:MM:ss",longTime:"HH:MM:ss Z",militaryTime:"HH:MM",isoDate:"yyyy-mm-dd",isoTime:"HH:MM:ss",isoDateTime:"yyyy-mm-dd'T'HH:MM:ss",isoUtcDateTime:"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",longDateTime:"dd/mm/yyyy HH:MM:ss Z",longDateTime2:"dd/mm/yy HH:MM",longDateTime3:"dd/mm/yyyy HH:MM",shortDateTime:"dd/mm HH:MM"};
dateFormat.i18n={dayNames:["Dom.","Lun.","Mar.","Mié.","Jue.","Vie.","Sáb.","Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"],monthNames:["Ene.","Feb.","Mar.","Abr.","May.","Jun.","Jul.","Ago.","Sep.","Oct.","Nov.","Dic.","Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]};
Date.prototype.format=function(mask,utc){return dateFormat(this,mask,utc);
};
Date.prototype.setISO8601=function(string){var regexp="([0-9]{4})(-([0-9]{2})(-([0-9]{2})(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(.([0-9]+))?)?(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
var d=string.match(new RegExp(regexp));
var offset=0;
var date=new Date(d[1],0,1);
if(d[3]){date.setMonth(d[3]-1);
}if(d[5]){date.setDate(d[5]);
}if(d[7]){date.setHours(d[7]);
}if(d[8]){date.setMinutes(d[8]);
}if(d[10]){date.setSeconds(d[10]);
}if(d[12]){date.setMilliseconds(Number("0."+d[12])*1000);
}if(d[14]){offset=(Number(d[16])*60)+Number(d[17]);
offset*=((d[15]=="-")?1:-1);
}offset-=date.getTimezoneOffset();
time=(Number(date)+(offset*60*1000));
this.setTime(Number(time));
};
if(typeof MPAGE_LC=="undefined"){var MPAGE_LC={};
}MPAGE_LC.es_ES={decimal_point:",",thousands_sep:".",grouping:"3",time24hr:"HH:MM:ss",time24hrnosec:"HH:MM",shortdate2yr:"d/m/yy",fulldate2yr:"dd/mm/yy",fulldate4yr:"dd/mm/yyyy",fullmonth4yrnodate:"mm/yyyy",full4yr:"yyyy",fulldatetime2yr:"dd/mm/yy HH:MM",fulldatetime4yr:"dd/mm/yyyy HH:MM",fulldatetimenoyr:"dd/mm h:MM TT"};
if(typeof i18n=="undefined"){var i18n={};}
i18n.RCM_CALENDAR_LOCALIZATION = "es";
//set to true for 24 hour format and false when 12 hour format
i18n.SET24HOUR = true;
if(typeof i18n=="undefined"){var i18n={};
}i18n.ACCORDING_TO_ZOOM="&nbsp;(el intervalo depende del zoom)";
i18n.ACTION="Acción";
i18n.ACTIVE="Activo";
i18n.ACTIVITY_LIST="Lista de actividades";
i18n.ACTIVITY_ORDER="Indicación de actividad";
i18n.ADD="Agregar";
i18n.ADMINISTERED="Administrado";
i18n.ADMIN_DATE="Fecha de administración";
i18n.ADMIN_LAST_N_HOURS="Administrado las últimas {0} horas";
i18n.ADMIN_NOTES="Notas de administración";
i18n.ADMISSION="Admisión";
i18n.ADMIT_DATE="Fecha de admisión";
i18n.ADMIT_DIAG="Diagnóstico de admisión";
i18n.ADMIT_DX="Diagnóstico de admisión";
i18n.ADMIT_INFO="Información de admisión";
i18n.ADMIT_PHYS="Médico responsable de la admisión";
i18n.ADMIT_SOURCE="Origen de admisión";
i18n.ADMIT_TO_BED_DT="Fecha de admisión en cama";
i18n.ADVANCE_DIRECTIVE="Avanzar directiva";
i18n.AEROSOL_THERAPY="Respuesta del paciente a medicación inhalada";
i18n.AEROSOL_THERAPY_DETAILS="Detalles de respuesta del paciente a medicación inhalada";
i18n.AGE="Edad";
i18n.ALARM_SETTINGS="Configuración de alarma";
i18n.ALARM_SETTINGS_DETAILS="Detalles de configuración de alarma";
i18n.ALLERGY="Alergia";
i18n.ALLERGY_NAME="Nombre de alergia";
i18n.ALL_DATA="Todos los datos";
i18n.ALL_N_VISITS="{0} para todas las visitas";
i18n.ANESTHESIA_TYPE="Tipos de anestesia";
i18n.ANESTH_START="Inicio de anestesia";
i18n.ANESTH_STOP="Finalización de anestesia";
i18n.ANNOTATED_DISPLAY="Nombre de visualización anotada";
i18n.ANNOTATED_DISPLAY_NAME="Visualización anotada";
i18n.APRIL=["Abr","Abril"];
i18n.ARRIVAL="Llegada";
i18n.ARTIFICIAL_AIRWAY="Vía respiratoria artificial";
i18n.ARTIFICIAL_AIRWAY_DETAILS="Detalles de vía respiratoria artificial";
i18n.ASSESSMENT="Evaluación";
i18n.ASSISTIVE_DEVICES="Tecnología asistencial";
i18n.ASSOCIATED_MICRO_REPORTS="Informes de microbiología asociados";
i18n.ASSOCIATED_MICRO_STAIN_REPORTS="Informes de tinción microbiológica asociados";
i18n.ATTENDING_PHD="Médico encargado";
i18n.ATTENDING_PHYSICIAN="Médico encargado";
i18n.ATTEND_PHYS="Médico encargado";
i18n.AUGUST=["Ago","Agosto"];
i18n.AUTH="Auto";
i18n.AUTHCOMMENTS="Comentarios de auto";
i18n.AUTHDATES="Fechas auto";
i18n.AUTHOR="Autor";
i18n.AUTHORIZATION="Autorización";
i18n.A_LINE="Catéter intraarterial";
i18n.All_VISITS="Todas las visitas";
i18n.BABY="Bebé";
i18n.BABY="Bebé";
i18n.BE="E.B.";
i18n.BENEFITS="Ventajas";
i18n.BILLING="Facturación";
i18n.BLOOD_PRESSURE="Tensión arterial";
i18n.BLOOD_TYPE_RH="RH de tipo de sangre";
i18n.BP_UNIT="(mmHg)";
i18n.BREATH_SOUNDS_ASSESSMENT="Evaluación de murmullo vesicular";
i18n.BREATH_SOUNDS_ASSESSMENT_DETAILS="Detalles de evaluación de murmullo vesicular";
i18n.BTN_HVR="Hacer clic para documentar varianza";
i18n.CANCEL="Cancelar";
i18n.CARDIO="Cardiovascular";
i18n.CAREMANAGERUMPAGE="Resumen de revisión de utilización";
i18n.CARE_LEVEL="Nivel de cuidados";
i18n.CASE_NUM="Número de caso";
i18n.CATEGORY="Categoría";
i18n.CHANGE="Cambiar";
i18n.CHEST="Tórax";
i18n.CHEST_ABD_XR="Radiografía de tórax/abdomen";
i18n.CHEST_PHYSIOTHERAPY="Higiene bronquial";
i18n.CHEST_PHYSIOTHERAPY_DETAILS="Detalles de higiene bronquial";
i18n.CHIEF_COMPLAINT="Queja principal";
i18n.CHILD_NAME="Nombre del bebé";
i18n.CLEAR_PREFERENCES="Borrar preferencias";
i18n.CLEAR_PREF_SUCCESS="Las preferencias se borraron correctamente";
i18n.CLICK_TO_GO_TO_DISCHARGE_PROCESS="Haga clic para ir al proceso de alta";
i18n.CLINICAL_DISPLAY="Visualización clínica";
i18n.CLOSE_X="CERRAR X";
i18n.CODE="Código";
i18n.CODE_STATUS="Estado de código";
i18n.COINSURANCEDAYSREMAINING="Días de coaseguro restantes";
i18n.COLLAPSE_ALL="Contraer todo";
i18n.COLLECTED="Tomada";
i18n.COLLECTED_DATE_TIME="Fecha/hora de toma";
i18n.COLLECTED_WITHIN="Toma dentro de";
i18n.COMMENTS="Comentarios";
i18n.COMPLETED="Completado";
i18n.COMPLETE_ORDERS="Indicaciones completas";
i18n.COMPLIANCE="Cumplimiento";
i18n.CONDITION="Condición";
i18n.CONTACTS="Contactos";
i18n.CONTACT_PHYSICIAN="Póngase en contacto con el médico antes de tomarlo(a)";
i18n.CONTINOUS="Continuo";
i18n.CONTINUE="Continuar";
i18n.CONTINUE_WITH_CHANGES="Continuar con los cambios";
i18n.COPAY="Copago";
i18n.COUGH_SUCTION="Aspiración de secreción bronquial";
i18n.COUGH_SUCTION_DETAILS="Detalles de aspiración de secreción bronquial";
i18n.COVEREDDAYSREMAINING="Días restantes con cobertura";
i18n.CRITICAL_HIGH="Alto crítico";
i18n.CRITICAL_LOW="Bajo crítico";
i18n.CRITICAL_RANGE="Intervalo crítico";
i18n.CRITICAL_RESULTS="Resultados críticos";
i18n.CRIT_IND="C";
i18n.CUFF="Manguito del esfigmomanómetro";
i18n.CURRENT="Actual";
i18n.CUR_DOC_PLAN_SCREEN="Plan/evaluación documentada actual";
i18n.CUSTOMIZE="Personalizar";
i18n.DATE="Fecha";
i18n.DATE_PERFORMED="Fecha de realización";
i18n.DATE_TIME="Fecha/hora";
i18n.DATE_TIME_INITIATED="Fecha/hora iniciada";
i18n.DAYS="Días";
i18n.DBP="Tensión arterial diastólica";
i18n.DC_COMPLETE="Completar";
i18n.DC_IN_PROGRESS="En curso";
i18n.DC_NOT_STARTED="No iniciado";
i18n.DC_PLANNING_TM_TRACKED="Hora de planificación de alta con seguimiento";
i18n.DC_REVIEWSIGN="Revisar y firmar";
i18n.DECEASED="Fallecido";
i18n.DECEMBER=["Dic","Diciembre"];
i18n.DEDUCTIBLE="Deducible";
i18n.DEDUCTIBLE_MET="Cumple";
i18n.DEGC="Grados C";
i18n.DEGF="Grados F";
i18n.DELAYREASON="Razón de retraso";
i18n.DELAYS_TRACKED="Retrasos con seguimiento";
i18n.DELIVERY_HOSPITAL="Hospital de partos";
i18n.DESCRIPTION="Descripción";
i18n.DETAILS="Detalles";
i18n.DEVICE_DETAILS="Detalles de dispositivo";
i18n.DIAGNOSES="Diagnóstico";
i18n.DIAGNOSES_DATE="Fecha de diagnóstico";
i18n.DIAGNOSES_NAME="Nombre de diagnóstico";
i18n.DIAGNOSTIC="Diagnóstico";
i18n.DIAGNOSTIC_DETAILS="Detalles de diagnóstico";
i18n.DIET="Dieta";
i18n.DISCERN_ERROR="Error de Discern";
i18n.DISCHARE_APPEALDELIVERED="Se entregó apelación de alta";
i18n.DISCHARGECAREMANAGEMENT="Resumen de gestión de cuidados de alta";
i18n.DISCHARGE_DATE="Fecha de alta";
i18n.DISCHARGE_DISPOSITION="Disposición de alta";
i18n.DISCHARGE_INFORMATION="Información de alta";
i18n.DISCHARGE_LOCATION="Ubicación de alta";
i18n.DISCHARGE_MIM_SIGNED="Se otorgó documento de derechos al alta";
i18n.DISCHARGE_PLANNER="Planificador de altas";
i18n.DISCHARGE_PROCESS="Proceso de alta";
i18n.DISCHARGE_SUMMARY="Resumen de alta";
i18n.DISCLAIMER="Esta página no es una fuente completa de información sobre la visita.";
i18n.DISCONTINUED="Interrumpido";
i18n.DISPLAY_AS="Mostrar como";
i18n.DISPLAY_MET="Mostrar resultados cumplidos";
i18n.DME_ANTICIPATED="Se anticipó equipo médico duradero";
i18n.DME_COORD="Se coordinó equipo médico duradero";
i18n.DOB="Fecha de nacimiento";
i18n.DOCUMENTATION_DETAILS="Detalles de documentación";
i18n.DOCUMENTED="Documentado";
i18n.DOCUMENTED_ACTION="Acción de varianza documentada";
i18n.DOCUMENTED_BY="Documentado por";
i18n.DOCUMENTED_VARIANCE="Razón de varianza documentada";
i18n.DOCUMENTS="Documentos";
i18n.DOCUMENT_FAVS="No se encuentran favoritos";
i18n.DONE="Listo";
i18n.DUE="Vencido";
i18n.ED_SUMMARY="Resumen de DU";
i18n.EKG="ECG";
i18n.EMER_CONTACT="Contacto de emergencia";
i18n.EMER_CONTACT="Contactos de emergencia";
i18n.EMER_NUMBER="Nº de emergencia";
i18n.EMER_NUMBER="Nº de emergencia";
i18n.ENCNTR_TYPE="Tipo de episodio clínico";
i18n.ENCOUNTERS="Episodios clínicos";
i18n.ENTERED="Introducido";
i18n.ERROR_OCCURED="Se produjo un error";
i18n.ERROR_OPERATION="Nombre de operación";
i18n.ERROR_OPERATION_STATUS="Estado de operación";
i18n.ERROR_RETREIVING_DATA="Error al recuperar los resultados";
i18n.ERROR_TARGET_OBJECT="Nombre del objeto de destino";
i18n.ERROR_TARGET_OBJECT_VALUE="Valor del objeto de destino";
i18n.ESTIMATED_DISCHARGE_DATE="Fecha de alta estimada";
i18n.EVENTS="Eventos";
i18n.EXAM="Examen";
i18n.EXPAND_ALL="Expandir todo";
i18n.EXPIRATION_DATE_TIME="Fecha/hora de vencimiento";
i18n.EXP_DATE="Fecha de vencimiento";
i18n.FALL_RISK_SCORE="Escala de riesgo de caídas";
i18n.FATHER_NAME="Nombre del padre";
i18n.FEBRUARY=["Feb","Febrero"];
i18n.FIN="Nº de episodio";
i18n.FINAL_DIAGNOSIS="Diagnóstico final";
i18n.FINAL_DRG="GD final";
i18n.FIN_CLASS="Clase financiera";
i18n.FIN_NUM="Nº de episodio clínico";
i18n.FIO2="FiO2";
i18n.FIRST_24HRS_ED_VISIT="Los resultados representan las primeras 24 horas de la visita a Urgencias";
i18n.FLAGGED="Marcado";
i18n.FLOW_RATE="Frecuencia del flujo";
i18n.FROM="Desde";
i18n.FUTURE="Futuro";
i18n.FU_ADDRESS="Dirección:";
i18n.FU_NAME="Nombre:";
i18n.GENERAL_ASSESSMENT="Evaluación general";
i18n.GESTATIONAL_AGE="Edad gestacional";
i18n.GI="GI";
i18n.GO_TO_TAB="Ir a la ficha {0}";
i18n.GROWTH="Crecimiento";
i18n.GROWTH_IND="Ind. de crecimiento";
i18n.GU="GU";
i18n.HEART_RATE="H";
i18n.HELP="Ayuda";
i18n.HIDE_LEGEND="Ocultar leyenda";
i18n.HIDE_SECTION="Contraer";
i18n.HI_FLOW_NEB="Nebulizador de alto flujo";
i18n.HI_IND="H";
i18n.HOME_MEDICATION="Medicación domiciliaria";
i18n.HOURS="Horas";
i18n.ICU_SUMMARY="Resumen de UCI";
i18n.IMAGING="Imágenes";
i18n.IMMUNIZATIONS="Vacunas";
i18n.IMMUNIZATIONS_DETAILS="Detalles de vacunas";
i18n.INCENTIVE_SPIROMETRY="Espirometría de incentivo";
i18n.INCENTIVE_SPIROMETRY_DETAILS="Detalles de espirometría de incentivo";
i18n.INCOMPLETE_ORDERS="Indicaciones incompletas";
i18n.INHALALATION="Inhalación";
i18n.INHALED="Inhalación";
i18n.INIT_DOC_DT_TM="Fecha/hora inicial documentada";
i18n.INPATIENT_SUMMARY="Resumen de paciente interno";
i18n.INSPIRATORY_TIME_DELIVERED="% de tiempo de inspiración";
i18n.INSPIRATORY_TIME_SET="Tiempo de inspiración";
i18n.INTEGUMENTARY="Tegumentario";
i18n.IO="Balance hídrico";
i18n.ISOLATION="Aislamiento";
i18n.ISOLATION="Aislamiento";
i18n.JANUARY=["Ene","Enero"];
i18n.JS_ERROR="Error de JavaScript";
i18n.JULY=["Jul","Julio"];
i18n.JUNE=["Jun","Junio"];
i18n.KEY_PERSON_RELATIONSHIPS="Relaciones con paciente clave";
i18n.LABRAD="Laboratorio/Radiología";
i18n.LABS="Laboratorios";
i18n.LAST="Última";
i18n.LAST_3_DAYS="Últimos 3 días para la visita seleccionada";
i18n.LAST_DOC="Documentado por última vez";
i18n.LAST_DOC_BY="Última documentación por";
i18n.LAST_DOC_DT_TM="Última fecha/hora documentada";
i18n.LAST_DOC_DT_TM="Última fecha/hora documentada";
i18n.LAST_DOC_WITHIN="Documentado por última vez en";
i18n.LAST_DOSE="Última dosis";
i18n.LAST_DOSE_DT_TM="Última dosis";
i18n.LAST_EVALUATION="Última evaluación";
i18n.LAST_GIVEN="Última administración";
i18n.LAST_N_DAYS="Últimos {0} días";
i18n.LAST_N_HOURS="Últimas {0} horas";
i18n.LAST_N_MONTHS="Últimos {0} meses";
i18n.LAST_N_WEEKS="Últimas {0} semanas";
i18n.LAST_N_YEARS="Últimos {0} años";
i18n.LAST_PARTICIPATION="Última participación";
i18n.LAST_UPDATED="Última actualización";
i18n.LAST_UPDATED_BY="Última actualización por";
i18n.LAST_VISIT="Última visita";
i18n.LATEST="Último";
i18n.LATEST_ABG_RESULTS="Últimos resultados de gasometría arterial";
i18n.LATEST_BLOOD_GAS_ARTERIAL="Última gasometría arterial";
i18n.LATEST_BLOOD_GAS_ARTERIAL_RESULTS="Resultados más recientes de gases sanguíneos arteriales";
i18n.LENGTH_OF_LABOR="Duración del parto";
i18n.LENGTH_OF_STAY="Duración de la estancia";
i18n.LIFETIMEMAX="Duración máx";
i18n.LINES="Líneas";
i18n.LOADING_DATA="Cargando";
i18n.LOCATION="Ubicación";
i18n.LOS="Nivel de servicio";
i18n.LOT="Lote";
i18n.LOW_IND="L";
i18n.LTRDAILYDEDUCTABLE="Franquicia diaria de rehabilitación a largo plazo";
i18n.LTRDAYSREMAINING="Días restantes de la reserva vitalicia";
i18n.MANUFACTURER="Fabricante";
i18n.MAP="Tensión arterial media";
i18n.MARCH=["Mar","Marzo"];
i18n.MASTER_GRAPH="Gráfico maestro";
i18n.MAX="Máx";
i18n.MAY=["Mayo","Mayo"];
i18n.MEASUREMENTS_ASSESSMENTS="Mediciones y evaluaciones";
i18n.MEASUREMENTS_ASSESSMENTS_DETAILS="Detalles de mediciones y evaluaciones";
i18n.MEASUREMENT_DETAILS="Detalles de medición";
i18n.MEDICATIONS="Medicación";
i18n.MEDS="Medicación";
i18n.MEDS_ADMINISTERED="Medicación administrada";
i18n.MED_DETAIL="Detalles de medicación";
i18n.MED_NAME="Medicación";
i18n.MEMBERS="Miembros";
i18n.MESSAGE="Mensaje";
i18n.MET="cumple";
i18n.MICRO="Micro";
i18n.MIM_SIGNED="Documento de derechos firmado en admisión";
i18n.MIN="Mín";
i18n.MINS="Minutos";
i18n.MODEL="Modelo";
i18n.MODE_OF_ARRVAL="Modo de llegada";
i18n.MODIFIERS="Modificadores";
i18n.MOTHER="Madre";
i18n.MRN="NºHªC";
i18n.MULTIPLE="Múltiple";
i18n.MUSCULOSKELETAL="Musculoesquelético";
i18n.NAME="Nombre";
i18n.NEBULIZED="Nebulizador";
i18n.NEG="Neg";
i18n.NEURO="Neurología";
i18n.NEW="Nuevo";
i18n.NEXT_DOSE="Dosis siguiente";
i18n.NEXT_DOSE_DT_TM="Dosis siguiente";
i18n.NEXT_N_HOURS="Próximas {0} horas";
i18n.NORMALITY="Normalidad";
i18n.NORMAL_HIGH="Alto normal";
i18n.NORMAL_LOW="Bajo normal";
i18n.NORMAL_RANGE="Intervalo normal";
i18n.NOTE="Nota";
i18n.NOTE_INDICATOR="* Indica un día sin un período de medición de 24 horas completo.";
i18n.NOTE_NAME="Nombre de nota";
i18n.NOTE_TYPE="Tipo de nota";
i18n.NOT_DONE="No realizado";
i18n.NOVEMBER=["Nov","Noviembre"];
i18n.NO_BILLING_FAVORITES="No se encontraron facturaciones favoritas";
i18n.NO_DATA="Sin datos";
i18n.NO_GROWTH="Sin crecimiento";
i18n.NO_IMAGING_FAVORITES="No se encontraron creaciones de imágenes favoritas";
i18n.NO_KEY_PERSONS="No se encuentran pacientes clave";
i18n.NO_KNOWN_HOME_MEDS="No hay medicación domiciliaria conocida para este paciente.";
i18n.NO_LABS_FAVORITES="No se encontraron análisis de laboratorio favoritos";
i18n.NO_LONGER_TAKING="Ya no se está tomando";
i18n.NO_MEDS_FAVORITES="No se encontró medicación favorita";
i18n.NO_ORDERS_FOR_SIGNATURE="No hay indicaciones para firmar";
i18n.NO_OTHER_FAVORITES="No se encontraron otros favoritos";
i18n.NO_PREV_RES="-- No se encuentran resultados previos --";
i18n.NO_PREV_RES_LAST_24_HRS="-- No se encuentran resultados previos para las últimas 24 horas --";
i18n.NO_RES="-- No se encuentran resultados --";
i18n.NO_RESULTS="Sin resultados";
i18n.NO_RESULTS_FOUND="No se encuentran resultados";
i18n.NO_RES_LAST_24_HRS="-- No se encuentran resultados para las últimas 24 horas --";
i18n.NO_RES_LAST_LOOKBACK_HRS="--No hay resultados en el periodo de recuerdo--";
i18n.NO_SUPPORT_CHARACTERS="Actualmente no se admiten los caracteres ^ y $.";
i18n.NO_ZOOM_APPLIED="Sin zoom aplicado";
i18n.NUMBER="Número";
i18n.NUMBEROFDAYS="Número de días";
i18n.NURSING_COMMUNICATION="Comunicación de enfermería";
i18n.O2_FLOW_RATE="Frecuencia de flujo de O2";
i18n.O2_THERAPY_TITRATION="Oxigenoterapia/dosis de oxígeno";
i18n.O2_THERAPY_TITRATION_DETAILS="Detalles de oxigenoterapia/dosis de oxígeno";
i18n.OCTOBER=["Oct","Octubre"];
i18n.OF="de";
i18n.ONSET_DATE="Fecha de comienzo";
i18n.ORDERED="Indicada";
i18n.ORDERING_PHYSICIAN="Médico que realiza la indicación";
i18n.ORDERS="Indicaciones";
i18n.ORDERS_FOR_SIGNATURE="Indicaciones para firmar";
i18n.ORDER_DATE="Fecha/hora de indicación";
i18n.ORDER_DATE_TIME="Fecha/hora de indicación";
i18n.ORDER_DETAILS="Detalles de indicación";
i18n.ORDER_DISPLAY_LINE="Línea de visualización de indicación";
i18n.ORDER_FAVORITE="Favorito de indicación";
i18n.ORDER_NAME="Indicación";
i18n.ORDER_NAME="Nombre de indicación";
i18n.ORDER_PARAMETERS="Parámetros de indicación";
i18n.ORDER_PHYS="Indicado por";
i18n.ORDER_STATUS="Estado";
i18n.ORDER_TYPE="Tipo de indicación";
i18n.ORIG_DT_TM="Fecha/hora de indicación original";
i18n.OTHER="Otros";
i18n.OTHER_DIAGNOSTICS="Otros diagnósticos";
i18n.OTHER_RESULTS="Otros resultados";
i18n.OVERDUE_TASKS="Tareas vencidas";
i18n.PAIN="Dolor";
i18n.PAIN_SCORE="Escala del dolor";
i18n.PARA_GRAVIDA="Partos/embarazos";
i18n.PARENT_PART_TYPE="Relación del tutor legal";
i18n.PAST_PROBLEM="Problema";
i18n.PAST_RESOLVED_DATE="Fecha de resolución";
i18n.PATIENT_ASSESSMENT="Evaluación del paciente";
i18n.PATIENT_FAMILY_EDUCATION="Educación para la familia del paciente";
i18n.PATIENT_FAMILY_EDUCATION_DETAILS="Detalles de educación para la familia del paciente";
i18n.PEEP="PEEP";
i18n.PERCENTILE="Percentil";
i18n.PERSON_NAME_HEADER="Nombre de paciente";
i18n.PE_DATE="Fecha:";
i18n.PE_INSTRUCTION="Instrucción:";
i18n.PE_PROVIDER="Profesional asistencial:";
i18n.PHOTOTHERAPY="Fototerapia";
i18n.PHOTOTHERAPY_RESULT="Resultado";
i18n.PLANNED_DISCHARGE_DISP="Disposición de alta planificada";
i18n.PLANNED_DISCHARGE_DT_TM="Fecha de alta planificada";
i18n.PLAN_NAME="Nombre de plan";
i18n.POC_SUMMARY="Resumen de plan de cuidados";
i18n.POS="Pos";
i18n.PREGNANCY="Embarazo";
i18n.PREGNANCY_DETAILS="Detalles de embarazo";
i18n.PRESCRIBED="Prescrito";
i18n.PREVIOUS="Anterior";
i18n.PREVIOUS_ABG_RESULTS="Resultados previos de gasometría arterial";
i18n.PREVIOUS_BLOOD_GAS_ARTERIAL="Gasometría arterial previa";
i18n.PREVIOUS_BLOOD_GAS_ARTERIAL_RESULTS="Resultados previos de gases sanguíneos arteriales";
i18n.PRIMARY="Principal";
i18n.PRIMARY_RESULTS="Resultados principales";
i18n.PRIM_PHYS="Médico principal";
i18n.PRIORITY="Prioridad";
i18n.PRN="A demanda";
i18n.PRN_48="Administrado a demanda en las últimas 48 horas";
i18n.PRN_ALL="Todo a demanda";
i18n.PRN_UNSCHEDULED="A demanda/No programado disponible";
i18n.PROBLEM="Problema";
i18n.PROBLEMS="Problemas";
i18n.PROBLEMS_DETAILS="Detalles de problemas";
i18n.PROBLEMS_NAME="Nombre de problema";
i18n.PROCEDURE="Procedimiento";
i18n.PROCEDURE_DATE="Fecha de procedimiento";
i18n.PROCEDURE_DETAILS="Detalles de procedimiento";
i18n.PROCEDURE_NAME="Nombre de procedimiento";
i18n.PRODUCT="Producto";
i18n.PROFSKILLEDSERVICESANTICIPATED="Se anticiparon servicios profesionales";
i18n.PROVIDER="Profesional asistencial";
i18n.PSYCHOSOCIAL_FACTORS="Factores psicosociales";
i18n.PULMONARY_SUMMARY="Resumen pulmonar";
i18n.QM_COMPLETE="Completar";
i18n.QM_CONDITION="Estado:";
i18n.QM_INCOMPLETE="Incompleto";
i18n.RCM_ACTUAL_DISCHARGE_DISPOSITION="Disposición de alta real";
i18n.RCM_ADDENDUM="Addendum";
i18n.RCM_ADDENDUM_BY="Addendum por:";
i18n.RCM_ADDITIONAL_NOTES="Notas adicionales";
i18n.RCM_ADDITIONAL_REVIEWER_NOTES="Notas adicionales del revisor";
i18n.RCM_ADD_ADDENDUM="Agregar Addendum";
i18n.RCM_ADMITTING_DX="Diagnóstico de admisión";
i18n.RCM_ADMITTING_DX_DESC="Descripción de diagnóstico de admisión";
i18n.RCM_ADMIT_DATE="Fecha de admisión";
i18n.RCM_ADMIT_SOURCE="Origen de admisión";
i18n.RCM_ADMIT_TO_BED_DT="Fecha y hora de admisión en cama";
i18n.RCM_ADM_MIM="Documento de derechos en admisión";
i18n.RCM_ADVANCE_DIR_COMPL="Voluntades anticipadas completadas";
i18n.RCM_ADVANCE_DIR_ON_FILE="Voluntades anticipadas en archivo";
i18n.RCM_AGE="Edad";
i18n.RCM_ALTERNATE_DRG="DRG alternativo";
i18n.RCM_ATTENDING_PHYSICIAN="Médico encargado";
i18n.RCM_AVOIDABLE_DAYS="Días evitables";
i18n.RCM_BED="Cama";
i18n.RCM_CANCEL="Cancelar";
i18n.RCM_CANCEL_MESSAGE="¿Está seguro de que desea cancelar?  Se perderán todos los cambios.";
i18n.RCM_CARE_GUIDELINE="Directriz de cuidados";
i18n.RCM_CARE_MANAGEMENT="Gestión de cuidados";
i18n.RCM_CLINICAL_REVIEW="Revisión clínica";
i18n.RCM_CLINICAL_REVIEW_ENTRY="Entrada de revisión clínica";
i18n.RCM_CLINICAL_REVIEW_SUMMARY="Resumen de revisión clínica";
i18n.RCM_COLON=":";
i18n.RCM_COMPLETE="Completar";
i18n.RCM_CONTINUED_STAY="Estancia continua";
i18n.RCM_CRITERIA_MET="Criterios cumplidos";
i18n.RCM_CURRENT_ENCOUNTER="Episodio clínico actual";
i18n.RCM_DATE="Fecha";
i18n.RCM_DATEPICKER_TEXT="Elija una fecha";
i18n.RCM_DAY_REVIEWED="Día revisado";
i18n.RCM_DELETE="Eliminar revisión clínica";
i18n.RCM_DELETE_FAILED="Falló la eliminación";
i18n.RCM_DELETE_FAILED_MESSAGE="Otro usuario ha modificado la revisión clínica seleccionada desde su apertura.  No se puede eliminar la revisión clínica.";
i18n.RCM_DELETE_MESSAGE="¿Está seguro de que desea eliminar la revisión clínica seleccionada?";
i18n.RCM_DELETE_REVIEW="Eliminar revisión";
i18n.RCM_DENIED_DAYS="Días denegados";
i18n.RCM_DISCHARGE_ASSESSMENT_INFO="Información de evaluación de alta";
i18n.RCM_DISCHARGE_BARRIERS="Barreras de alta";
i18n.RCM_DISCHARGE_DATE="Fecha de alta";
i18n.RCM_DISCHARGE_DISPOSITION="Disposición de alta";
i18n.RCM_DISCHARGE_FACILITY="Centro de alta";
i18n.RCM_DISCHARGE_NEXT_ASSESSMENT_DT="Fecha y hora de evaluación siguiente de alta";
i18n.RCM_DISCHARGE_OF_SERVICES="Alta de servicios";
i18n.RCM_DISCHARGE_PENDING="Alta pendiente";
i18n.RCM_DISCHARGE_SCREEN="Evaluar al alta";
i18n.RCM_DISCHARGE_SCREENING="Evaluación al alta";
i18n.RCM_DISCHARGE_SLOT="Espacio de alta";
i18n.RCM_DISPLAY="Visualizar";
i18n.RCM_DNR="No reanimar";
i18n.RCM_DOB="Fecha de nacimiento";
i18n.RCM_DONE="Listo";
i18n.RCM_DRG_DESC="Desc. DRG";
i18n.RCM_ELOS="ELOS";
i18n.RCM_ENCOUNTER_TYPE="Tipo de episodio clínico";
i18n.RCM_ESTIMATED_DISCHARGE_DATE="Fecha de alta estimada";
i18n.RCM_FACILITY="Centro";
i18n.RCM_FAX_REVIEWS="Revisiones de fax";
i18n.RCM_FC="F/C";
i18n.RCM_FIN="Nº de episodio";
i18n.RCM_FINAL="Final";
i18n.RCM_FINAL_AND_NEXT="Final y siguiente";
i18n.RCM_FINAL_DRG="GD final";
i18n.RCM_FINAL_DX="Diagnóstico final";
i18n.RCM_FINAL_PRIMARY_DX="Diagnóstico principal final";
i18n.RCM_FINANCIAL_CLASS="Clase financiera";
i18n.RCM_INCLUDE_CLOSED_UM_REVIEWS="Incluir revisiones de gestión de utilización cerradas";
i18n.RCM_INTENSITY_OF_SERVICES="Intensidad de servicios";
i18n.RCM_LAST_ASSESSMENT_DATE="Fecha de última evaluación";
i18n.RCM_LAST_REVIEW_DATE="Fecha de última revisión";
i18n.RCM_LEVEL_OF_SERVICE_SUBTYPE="Subtipo de nivel de servicio";
i18n.RCM_LOS="Nivel de servicio";
i18n.RCM_LOS_ELOS="Duración de la estancia (LOS) / Duración de la estancia estimada (ELOS):";
i18n.RCM_MARK_AS_FINAL="Indicar como Final";
i18n.RCM_MED_SERVICE="Servicio médico";
i18n.RCM_MET="Cumple";
i18n.RCM_MODIFY="Modificar";
i18n.RCM_MRN="NºHªC";
i18n.RCM_MY_RELATIONSHIP="Mi relación";
i18n.RCM_NAME="Nombre";
i18n.RCM_NEXT_CLINICAL_REVIEW="La próxima revisión clínica se entregará el:";
i18n.RCM_NEXT_CLINICAL_REVIEW_DATE="Fecha de revisión clínica siguiente";
i18n.RCM_NEXT_CL_REVIEW="Revisión clínica siguiente";
i18n.RCM_NEXT_REVIEW_NEEDED="Se necesita revisión siguiente";
i18n.RCM_NEXT_SECTION="Siguiente sección";
i18n.RCM_NO="No";
i18n.RCM_NOMENCLATUREID="Id. de nomenclatura:";
i18n.RCM_NOT_MET="No cumplido";
i18n.RCM_OBS_END_DTTM="Fecha/hora de fin de observación";
i18n.RCM_OBS_START_DTTM="Fecha/hora de inicio de observación";
i18n.RCM_OK="Aceptar";
i18n.RCM_OPEN_CLINICAL_REVIEW="Abrir revisión clínica";
i18n.RCM_OUTCOME="Resultado";
i18n.RCM_PATIENT_LIST="Lista de pacientes";
i18n.RCM_PAYER="Pagador";
i18n.RCM_PENDING="Pendiente";
i18n.RCM_PLANNED_DISCHARGE_DATE="Fecha de alta planificada";
i18n.RCM_PLANNED_DISCHARGE_DISPOSITION="Disposición de alta planificada";
i18n.RCM_PREVIOUS_ADMISSION_INFO="Información de admisión previa";
i18n.RCM_PRIMARY_DX="Diagnóstico principal";
i18n.RCM_PRIMARY_UR_NURSE="Enfermero principal de UR";
i18n.RCM_REASON_FOR_REFERRAL="Razón de referencia";
i18n.RCM_REVIEW="Revisar";
i18n.RCM_REVIEWER="Revisor";
i18n.RCM_REVIEW_CRITERIA="Criterios de revisión";
i18n.RCM_REVIEW_DATE="Fecha de revisión";
i18n.RCM_REVIEW_DUE="Revisión vencida";
i18n.RCM_REVIEW_OUTCOME="Revisar resultado";
i18n.RCM_REVIWED_BY="Revisado por:";
i18n.RCM_REVIW_TYPE="Revisar tipo";
i18n.RCM_ROOM="Habitación";
i18n.RCM_SAVE="Guardar";
i18n.RCM_SAVE_AND_NEW="Guardar y nuevo";
i18n.RCM_SAVE_FAILED="Fallo al guardar";
i18n.RCM_SAVE_FAILED_MESSAGE="Otro usuario ha modificado la revisión clínica seleccionada desde su apertura.  No se pueden actualizar los cambios realizados a su revisión clínica.";
i18n.RCM_SECONDARY_REVIEW="Revisión secundaria";
i18n.RCM_SECONDARY_REVIEW_NEEDED="Se necesita revisión secundaria";
i18n.RCM_SEVERITY_OF_ILLNESS="Gravedad de la enfermedad";
i18n.RCM_SOURCE_IDENTIFIER="Identificador de origen:";
i18n.RCM_SR_DATE="Fecha de revisión secundaria";
i18n.RCM_SR_STATUS="Estado de revisión secundaria";
i18n.RCM_SSN="NSS";
i18n.RCM_STATUS="Estado";
i18n.RCM_TYPE="Tipo";
i18n.RCM_UM_INFO="Información de gestión de utilización";
i18n.RCM_UM_STATUS="Estado de gestión de utilización";
i18n.RCM_UNIT="Unidad";
i18n.RCM_UNIT_DISCHARGE_FROM="Alta de unidad de";
i18n.RCM_UTILIZATION_MANAGEMENT="Administración de utilización";
i18n.RCM_VISIT_INFO="Información de visita";
i18n.RCM_WORKING_DRG="DRG de trabajo";
i18n.RCM_WORKING_DRG_DESC="Descripción de DRG de trabajo";
i18n.RCM_YES="Sí";
i18n.REACTION="Reacción";
i18n.REASON="Razón";
i18n.REASON_FOR_VISIT="Razón de la visita";
i18n.RECOMMENDATION="Recomendación";
i18n.REG_DT_TM="Fecha/hora de registro";
i18n.RELATIONSHIP_HEADER="Relación";
i18n.REMAINING="Restante";
i18n.REMINDERS="Recordatorios";
i18n.RENDERING_DATA="Representación";
i18n.REQUEST="Solicitud";
i18n.REQUESTED_START="Inicio solicitado";
i18n.RESET="Restablecer zoom";
i18n.RESPIRATORY="Respiratorio";
i18n.RESPIRATORY_DESCRIPTION="Descripción respiratoria";
i18n.RESPIRATORY_DESCRIPTION_DETAILS="Detalles de descripción respiratoria";
i18n.RESPIRATORY_DISCLAIMER="Los resultados de la gasometría arterial mostrados deben estar sincronizados con la fuente de oxígeno de FiO2, y/o el flujo de oxígeno administrado al paciente en el momento en que se obtuvo la muestra.";
i18n.RESPONSIBLE_PROVIDER="Indicación escrita por";
i18n.RESPONSIBLE_PROVIDER_NAME="Profesional asistencial responsable";
i18n.RESP_MONITORING="Monitorización respiratoria";
i18n.RESP_RATE_TOTAL="Frecuencia respiratoria total";
i18n.RESTRAINT="Sujeción";
i18n.RESTRAINTS="Sujeciones";
i18n.RESTRAINT_APPLIED="Sujeción aplicada";
i18n.RESTRAINT_DEATILS="Detalles de sujeción";
i18n.RESTRAINT_LOCATION="Ubicación de sujeción";
i18n.RESTRAINT_REASON="Razón de sujeción";
i18n.RESTRAINT_TYPE="Tipo de sujeción";
i18n.RESULT="Resultado";
i18n.RESULTS_RETURNED="Resultados devueltos";
i18n.RESULTS_SINCE_ADMITTED="Resultados desde la hora de admisión";
i18n.RESULT_DETAILS="Detalles de resultado";
i18n.RESULT_DT_TM="Fecha/hora de resultado";
i18n.RESUSITATION_STATUS="Estado de reanimación";
i18n.RFV="Razón de la visita";
i18n.RFV="Razón de la visita";
i18n.ROOM_BED="Habitación/Cama";
i18n.SAVE_PREFERENCES="Guardar preferencias";
i18n.SAVE_PREF_SUCCESS="Las preferencias se guardaron correctamente";
i18n.SBP="Tensión arterial sistólica";
i18n.SCHEDULED="Programado";
i18n.SCHEDULED_INH="Inhalado programado";
i18n.SEARCH_MODE="Modo de búsqueda";
i18n.SECONDARY="Secundario";
i18n.SECONDARY_PROCEDURE="Procedimiento secundario";
i18n.SECONDARY_RESULTS="Resultados secundarios";
i18n.SEIZURE_PRECAUTIONS="Precauciones ante convulsiones";
i18n.SELECT="Seleccionar";
i18n.SELECTED_N_VISIT="{0} para la visita seleccionada";
i18n.SELECTED_VISIT="Visita seleccionada";
i18n.SEPTEMBER=["Sep","Septiembre"];
i18n.SERVICE="Servicio";
i18n.SETTINGS="Configuración";
i18n.SETTINGS_DETAILS="Detalles de configuración";
i18n.SET_RATE="Establecer frecuencia";
i18n.SET_TIDAL_VOLUME="Establecer volumen corriente";
i18n.SEVERITY="Gravedad";
i18n.SEX="Sexo";
i18n.SHOW_LEGEND="Mostrar leyenda";
i18n.SHOW_SECTION="Expandir";
i18n.SHOW_UP="Presentado";
i18n.SIGN="Firmar";
i18n.SIGNATURE_LINE="Línea de firma";
i18n.SIGN_FAILED="Error al firmar";
i18n.SIG_LINE="SIG Línea";
i18n.SINCE="Desde";
i18n.SITUATION_BACKGROUND="Situación/antecedentes";
i18n.SOCIAL_HISTORY_DETAILS="Detalles de historial social";
i18n.SOCIAL_HISTORY_INFORMATION="Información de historial social";
i18n.SOURCE="Origen";
i18n.SOURCE_BODY_SITE="Origen/zona del cuerpo";
i18n.SOURCE_SITE="Origen/zona";
i18n.START="Iniciar";
i18n.START_DT_TM="Fecha/hora de inicio";
i18n.STATUS="Estado";
i18n.STATUS_DATE="Fecha/hora de estado";
i18n.STICKY_NOTES="Notas adhesivas";
i18n.STOP="Detener";
i18n.STOP_DT_TM="Fecha/hora de finalización";
i18n.STOP_REASON="Razón de finalización";
i18n.STUDY="Estudio";
i18n.SUBJECT="Asunto";
i18n.SUBMIT_FOR_SIGNATURE="Enviar para firmar";
i18n.SURGEON="Cirujano";
i18n.SURGERY_START="Inicio de cirugía";
i18n.SURGERY_STOP="Finalización de cirugía";
i18n.SURGICAL_FREE_TEXT="Texto libre para cirugía";
i18n.SUSCEPTIBILITY="Susceptibilidad";
i18n.SUSC_HEADER="SC";
i18n.SUSPENDED="Suspendido";
i18n.TABLE_GRAPH_DISCLAIMER="Los últimos valores documentados aparecen en la tabla para el intervalo de tiempo indicado.";
i18n.TARGETED_DISCHARGE_DATE="Fecha de alta meta";
i18n.TARGET_DISCH_DT_TM="Fecha/hora de alta límite";
i18n.TEMPERATURE="Temperatura";
i18n.TERTIARY="Terciario";
i18n.TEXT="Texto";
i18n.TOTAL_FL_BAL="Balance hídrico total";
i18n.TOTAL_FL_INTAKE="Aporte hídrico total";
i18n.TOTAL_FL_OUTPUT="Egreso hídrico total";
i18n.TOTAL_MINUTE_VOLUME="Volumen respiratorio por minuto total";
i18n.TOTAL_RESPIRATORY_RATE="Frecuencia respiratoria total";
i18n.TRANSFER_OF_CARE_PACKET="Traslado de paquete de cuidados";
i18n.TRANSFUSIONS="Transfusiones";
i18n.TRANSFUSIONS="Transfusiones";
i18n.TRANSFUSION_EVENT_CD="Event code de transfusión";
i18n.TRANSFUSION_RESULT_VAL="Valor del resultado";
i18n.TRANSPLANT_DATE="Fecha de trasplante";
i18n.TRANSPORATION_ARRANGED="Transporte organizado";
i18n.TUBES_DRAINS="Sondas/drenajes";
i18n.TWO_DAY_MAX="Máximo 48 horas";
i18n.TYPE="Tipo";
i18n.UNABLE_TO_OBTAIN_MED_HIST="No se puede obtener la información del historial de medicación para la visita seleccionada.";
i18n.UNIT_OF_MEASURE="Unidad de medida";
i18n.UNKNOWN="Desconocido";
i18n.UNSCHEDULED="No programado";
i18n.USER_CUSTOMIZATION="Personalización de usuario";
i18n.USER_CUST_DISCLAIMER="Tenga en cuenta la resolución de pantalla antes de seleccionar una visualización de tres columnas.";
i18n.VENTILATOR_INFO="Información sobre respirador";
i18n.VENTILATOR_MODE="Modo de respirador";
i18n.VENT_ALARMS_ON="Alarmas resp., activadas y funcionales";
i18n.VENT_ID="Id. de respirador/máquina";
i18n.VENT_MODE="Modo de respirador";
i18n.VENT_MODEL="Modelo de respirador/máquina";
i18n.VISIT="Visita";
i18n.VISIT="Visita";
i18n.VISIT_DETAILS="Detalles de visita";
i18n.VISIT_REASON="Razón de visita";
i18n.VITALS_TABLE="Tabla de constantes vitales";
i18n.WEANING_PARAMETERS="Parámetros de retirada";
i18n.WEANING_PARAMETERS_DETAILS="Detalles de parámetros de retirada";
i18n.WITHIN="en";
i18n.WITHIN_DAYS="{0} días";
i18n.WITHIN_HOURS="{0} h";
i18n.WITHIN_MINS="{0} min";
i18n.WITHIN_MONTHS="{0} mes";
i18n.WITHIN_WEEKS="{0} sem";
i18n.WITHIN_YEARS="{0} añ";
i18n.ZSCORE="Puntuación Z";
if(typeof i18n.discernabu=="undefined"){i18n.discernabu={};
}i18n.discernabu.ADD="Agregar";
i18n.discernabu.ALL_N_VISITS="{0} para todas las visitas";
i18n.discernabu.All_VISITS="Todas las visitas";
i18n.discernabu.CLEAR_PREFERENCES="Borrar preferencias";
i18n.discernabu.COLLAPSE_ALL="Contraer todo";
i18n.discernabu.CUSTOMIZE="Personalizar";
i18n.discernabu.DAYNAMES=["Dom","Lun","Mar","Miér","Jue","Vier","Sáb","domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
i18n.discernabu.DESCRIPTION="Descripción";
i18n.discernabu.DIAGNOSIS="Diagnóstico";
i18n.discernabu.DISCERN_ERROR="Error de Discern";
i18n.discernabu.DISCLAIMER="Esta página no es una fuente completa de información sobre la visita.";
i18n.discernabu.DUPLICATE="Esta acción crearía un(a) {name} duplicado(a). No tiene la habilidad para agregar este(a) {name}.";
i18n.discernabu.ERROR_OPERATION="Nombre de operación";
i18n.discernabu.ERROR_OPERATION_STATUS="Estado de operación";
i18n.discernabu.ERROR_RETREIVING_DATA="Error al recuperar los resultados";
i18n.discernabu.ERROR_TARGET_OBJECT="Nombre del objeto de destino";
i18n.discernabu.ERROR_TARGET_OBJECT_VALUE="Valor del objeto de destino";
i18n.discernabu.EXPAND_ALL="Expandir todo";
i18n.discernabu.GO_TO_TAB="Ir a la ficha {0}";
i18n.discernabu.HELP="Ayuda";
i18n.discernabu.HIDE_SECTION="Contraer";
i18n.discernabu.JS_ERROR="Error de JavaScript";
i18n.discernabu.LAST_N_DAYS="Últimos {0} días";
i18n.discernabu.LAST_N_HOURS="Últimas {0} horas";
i18n.discernabu.LAST_N_MONTHS="Últimos {0} meses";
i18n.discernabu.LAST_N_WEEKS="Últimas {0} semanas";
i18n.discernabu.LAST_N_YEARS="Últimos {0} años";
i18n.discernabu.LOADING_DATA="Cargando";
i18n.discernabu.MESSAGE="Mensaje";
i18n.discernabu.MONTHNAMES=["Ene.","Feb.","Mar.","Abr.","May.","Jun.","Jul.","Ago.","Sep.","Oct.","Nov.","Dic.","Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
i18n.discernabu.NAME="Nombre";
i18n.discernabu.NO_PRIVS="No tiene privilegios para agregar el/la {name} seleccionado(a)";
i18n.discernabu.NO_RESULTS_FOUND="No se encuentran resultados";
i18n.discernabu.NUMBER="Número";
i18n.discernabu.PROBLEM="Problema";
i18n.discernabu.RENDERING_DATA="Representación";
i18n.discernabu.REQUEST="Solicitud";
i18n.discernabu.SAVE_PREFERENCES="Guardar preferencias";
i18n.discernabu.SELECTED_N_VISIT="{0} para la visita seleccionada";
i18n.discernabu.SELECTED_VISIT="Visita seleccionada";
i18n.discernabu.SHOW_SECTION="Expandir";
i18n.discernabu.STATUS="Estado";
i18n.discernabu.USER_CUSTOMIZATION="Personalización de usuario";
i18n.discernabu.USER_CUST_DISCLAIMER="Tenga en cuenta la resolución de pantalla antes de seleccionar una visualización de tres columnas.";
i18n.discernabu.WITHIN_DAYS="{0} días";
i18n.discernabu.WITHIN_HOURS="{0} h";
i18n.discernabu.WITHIN_MINS="{0} min";
i18n.discernabu.WITHIN_MONTHS="{0} mes";
i18n.discernabu.WITHIN_WEEKS="{0} sem";
i18n.discernabu.WITHIN_YEARS="{0} añ";
i18n.discernabu.X_DAYS="{0} días";
i18n.discernabu.X_HOURS="{0} hora(s)";
i18n.discernabu.X_MINUTES="{0} minuto(s)";
i18n.discernabu.X_MONTHS="{0} mes(es)";
i18n.discernabu.X_WEEKS="{0} semana(s)";
i18n.discernabu.X_YEARS="{0} año(s)";
var rcm_discharge_i18n = function(){
    return {
        RCM_ACTUAL_DISCHARGE_DISPOSITION: "Actual Disposition:",
        RCM_AC_ACUITY_LBL: "Acuity",        
        RCM_ADD_NOTE: "Add note",
        RCM_ADDITIONAL_ORDER: "Additional Order",
        RCM_ADM_IM: "Admission IM:",
        RCM_ADMIT_DATE: "Admitted:",
        RCM_ADMIT_DATE_LONG: "Admit Date",
        RCM_ADMIT_SOURCE: "Admit Source:",
        RCM_ADMIT_TYPE: "Admit Type:",
        RCM_ADVANCE_DIR: "Advanced Directive:",    
        RCM_ADVANCE_DIR_LOC: "Advanced Directive Location:",
        RCM_AC_AGE_LBL: "Age",
        RCM_AC_AMA_LBL: "AMA",
        RCM_ALERT_AUTH: "LOS has passed the Auth Date",
        RCM_ALERT_CONCURRENT_DENIAL: "Concurrent Denial documented",
        RCM_ALERT_DIFFERING_WORKING_DRGS : "Multiple working Groups exist",
        RCM_ALERT_LOS_ELOS: "Actual LOS > Expected LOS",
        RCM_ALERT_PDD: "LOS has passed the PDD Date",
        RCM_ALERT_READMIT: "Patient Readmitted",
        RCM_ALERT_UNASSIGNED_WITH_ORDERS: "Unassigned patient with discharge order",
        RCM_ALL: "All",
        RCM_ALL_FUTURE_ASSESSMENTS: "All future assessments",
        RCM_APPLY: "Apply",
        RCM_ASCENDING: "Ascending",
        RCM_ASSIGNED_TO_ME: "Assigned to Me",
        RCM_ASSIGNED_TO_OTHERS: "Assigned to Others",
        RCM_ATTENDING_PHYSICIAN: "Attending:",
        RCM_ATTENDING_PHYSICIAN_LONG: "Attending Physician",
        RCM_AUTH_END_DATE: "Auth End Date",
        RCM_AVOIDABLE_DAYS: "Avoidable Days Assigned:",
        RCM_AC_BMI_LBL: "BMI",
        RCM_CANCEL: "Cancel",
        RCM_CHART_DONE: "Chart Done",
        RCM_CHECKBOX_FILTER_HEADER: "Include patients with:",
        RCM_CODE_STATUS: "Code Status:",
        RCM_COLLAPSE: "Collapse all",
        RCM_AC_COMORBIDITY_INDEX_LBL: "Comorbidity Index",        
        RCM_COMPLETE: "COMPLETE",
        RCM_CONSULT_ORDER: "Consult Order",
        RCM_CURASPAN: "naviHealth",
        RCM_CURRENT_ADMIT: "Current Admission",
        RCM_DATEPICKER_TEXT: "Choose a Date",
        RCM_DASH: " - ",
        RCM_DAY: "day",
        RCM_DAYS: "days",
        RCM_DAY_AGO: "{0} day ago",
        RCM_DAYS_AGO: "{0} days ago",
        RCM_AC_DEMOGRAPHICS_HDR: "Demographics",
        RCM_DENIED_DAYS: "Denied Days:",
        RCM_DESCENDING: "Descending",
        RCM_DIAGNOSIS: "Diagnosis:",
        RCM_DISCHARGE_ASSESSMENT_INFO: "Discharge Assessment",
        RCM_DISCHARGE_BARRIERS: "Identified Barriers:",
        RCM_DISCHARGE_CONSULT_ORDER: "Discharge Consult Order",
        RCM_DISCHARGE_DATE: "Discharged:",
        RCM_DISCHARGE_FACILITY: "Destination Facility:",
        RCM_DISCHARGE_FROM: "Discharged From:",
        RCM_DISCHARGE_IM: "Discharge IM:",
        RCM_DISCHARGE_NEXT_ASSESSMENT_DT: "Next Assessment:",
        RCM_DISCHARGE_ORDER: "Discharge Order",
        RCM_DISCHARGE_ORDER_OR_PENDING_DISCHARGE_ORDER: "Discharge Order or Pending Discharge Order",
        RCM_DISCHARGE_PLAN_STATUS: "Discharge Plan Status",
        RCM_DISCHARGE_PLANNER: "Discharge Planner",
        RCM_DISCHARGE_SHORT: "Discharge",
        RCM_DISMISS: "Dismiss",
        RCM_AC_DIURETICS_CURRENT_LBL: "Diurectics Currently",
        RCM_AC_DIURETICS_HISTORY_LBL: "Diurectics History",
        RCM_DISPLAY_INCLUDE_COMPLETE_DISCHARGE_PLAN_STATUS: "Include complete discharge plans",
        RCM_DISPLAY_INCLUDE_NO_NEXT_REVIEW_DATE: "Include no next assessment date",
        RCM_DISPLAY_INCLUDE_NOT_NEEDED_DISCHARGE_PLAN_STATUS: "Include not needed discharge plans",
        RCM_DOB: "DOB:",
        RCM_DONE: "Done",
        RCM_DONE_WITH_DATE_TIME: "Done(With Date/Time)",
        RCM_DRG_CODE: "Group Code",
        RCM_DRG_COL: "Group",
        RCM_DRG_DESC: "Group Desc",
        RCM_DRG_FINAL_HOVER: "Final",
        RCM_DRG_WORKING_HOVER: "Working",
        RCM_DRG_WEIGHT: "Wgt:",
        RCM_ENCOUNTER_TYPE: "Encounter type: ",
        RCM_ENCOUNTER_TYPE_SHORT: "Encounter Type",
        RCM_ENSOCARE: "Ensocare",
        RCM_AC_ER_IN_LAST_SIX_MONTHS_LBL: "ER in last 6 months",
        RCM_ERROR_MESSAGE: "Error Retrieving Data",
        RCM_EXPAND: "Expand all",
        RCM_ESTIMATED_LENGTH_OF_STAY: "Estimated Length of Stay",
        RCM_FACILITY: "Facility:",
        RCM_FAX_FAILED_MESSAGE : "There are Post-Acute packets which have failed to fax and/or may fail to fax.",
        RCM_FILTER_SETTINGS: "Filter settings",
        RCM_FILTERS: "Filters",
        RCM_FIN: "FIN",
        RCM_FINAL_DRG: "Final Group:",
        RCM_FINAL_DX: "Final Dx:",
        RCM_FINAL_PRIMARY_DX: "Final Primary Dx:",
        RCM_FINANCIAL_CLASS: "FIN Class (Primary Ins.): ",
        RCM_FINANCIAL_CLASS_SHORT: "FIN Class (Primary Ins.)",
        RCM_FINANCIAL_NUMBER: "Financial Number",
        RCM_GENDER: "Gender",
        RCM_AC_HEPARIN_CURRENT_LBL: "Heparin Currently",    
        RCM_HIDE_DETAILS: "Hide Details",
        RCM_HOUR_AGO: "{0} hour ago",
        RCM_HOURS_AGO: "{0} hours ago",
        RCM_AC_HP_HDR: "H & P",
        RCM_IMPORTANT: "Important",        
        RCM_LAST_UPDATE_STATUS_HEADER: "Last Update Status:",
        RCM_LAST_UPDATE_STATUS_LOC: "{0} ({1}): ",
        RCM_LAST_UPDATE_STATUS: "{0} ({1})",
        RCM_INCLUDE_COMPLETED_DISCHARGE_PLAN: "Completed discharge plan status",
        RCM_INCLUDE_NOT_NEEDED_DISCHARGE_PLAN: "Not needed status",
        RCM_INPATIENT_ADMIT: "Inpatient Admit:",        
        RCM_AC_INPATIENT_IN_LAST_SIX_MONTHS_LBL: "Inpatient in last 6 months",
        RCM_AC_INSURANCE_LBL: "Insurance",        
        RCM_AC_INSULIN_CURRENT_LBL: "Insulin Currently",
        RCM_AC_INSULIN_HISTORY_LBL: "Insulin History",            
        RCM_LAST_ASSESSMENT_DATE: "Last Assessment:",
        RCM_LAST_CLINICAL_REVIEW_DATE: "Last Clinical Review Date: ",
        RCM_LAST_POST_ACUTE_UPDATE: "Last Post Acute Update",
        RCM_LAST_POST_ACUTE_UPDATE_TYPE: "Last Update: {1} ({0})",
        RCM_LENGTH_OF_STAY: "Length of Stay",
        RCM_LOAD_ORDER_DETAILS_FAILED: "Load Order Details Failure",
        RCM_LOAD_ORDER_DETAILS_FAILED_MESSAGE: "Unable to load order details.",
        RCM_LOAD_RISK_DETAILS_FAILED: "Load Risk Details Failure",
        RCM_LOAD_RISK_DETAILS_FAILED_MESSAGE: "Unable to load risk details.",
        RCM_LOAD_REFERRALS_FAILED: "Load referrals Failure",
        RCM_LOAD_REFERRALS_FAILED_MESSAGE: "Unable to load referrals.",
        RCM_LIST_MAINTENANCE: "List Maintenance",
        RCM_LOCATION: "Location",    
        RCM_AC_MEDICATION_HDR: "Medication",
        RCM_POST_ACUTE: "Post Acute",
        RCM_MED_SERVICE: "Med Service:",
        RCM_MINUTE_AGO: "{0} minute ago",
        RCM_MINUTES_AGO: "{0} minutes ago",
        RCM_MISSING_DATA: "--",
        RCM_MRN: "MRN:",
        RCM_MY_RELATIONSHIP: "Relationship: ",
        RCM_NEXT_DISCHARGE_ASSESSMENT: "Next Assessment",
        RCM_NEXT_DISCHARGE_ASSESSMENT_LOWERCASE: "Next assessment: ",
        RCM_NO: "No",
        RCM_NO_ACTIVE_LISTS: "There are no active lists.",
        RCM_NO_ACTIVE_LISTS_LINE_2: "To manage your patient lists, access ",
        RCM_NOTE: "Note",
        RCM_NO_DATE: "No Date",
        RCM_NO_NEXT_ASSESSMENT: "No next assessment",
        RCM_NO_NOTES: "No current notes",
        RCM_NO_PATIENT_LISTS: "There are no patient lists defined in Powerchart.",
        RCM_NO_PRIMARY_PLAN : "No Primary Insurance",
        RCM_NO_RESULTS_FOUND: "No Results Found.",
        RCM_NO_TASK_AVAILABLE: "No Task Available",
        RCM_NONE: "None",
        RCM_NOT_AVAILABLE: "Not Available",
        RCM_NOT_DONE: "Not Done",
        RCM_NOT_NEEDED: "NOTNEEDED",
        RCM_NURSE_UNIT: "Nurse Unit",
        RCM_NURSE_UNIT_ROOM_BED: "Nurse Unit/Room/Bed",
        RCM_NO_UPDATE: " No Update",
        RCM_AC_OBSERVATION_IN_LAST_SIX_MONTHS_LBL: "Observation in last 6 months",
        RCM_OBS_END_DTTM: "OBS End:",
        RCM_OBS_START_DTTM: "OBS Start:",
        RCM_OF: "of",
        RCM_OK: "OK",
        RCM_ORDER: "Order:",
        RCM_ORDER_COMMENTS: "Order Comments:",
        RCM_ORDER_ID: "Order ID:",
        RCM_ORDERED_DATE: "Ordered Date:",
        RCM_ORDERING_PROVIDER: "Ordering Provider:",
        RCM_PATIENT: "Patient",
        RCM_PATIENT_AGE: "Patient Age",
        RCM_PATIENT_LIST: "Patient list:",
        RCM_PATIENT_NAME: "Patient Name",
        RCM_PATIENT_NAME_DISCHARGE_PLANNING_TAB: "Care Management Discharge Planning",
        RCM_PATIENTS: "Patients",
        RCM_PAYER: "Payer:",
        RCM_PAYER_PRIMARY: "Payer (Primary):",
        RCM_PAYER_SHORT: "Payer",
        RCM_PERSIST: "Persist across encounters",
        RCM_PERSIST_MESSAGE: "This option saves the note at the person level. The note will display regardless of the encounter selected.",
        RCM_PLAN: "Plan: ",
        RCM_PLANNED_DISCHARGE_DATE: "Planned Discharge:",
        RCM_PLANNED_DISCHARGE_DISPOSITION: "Planned Disposition:",
        RCM_RECOMMENDED_DISCHARGE_DISPOSITION: "Recommended Discharge Disposition:",
        RCM_RECOMMENDED_DISCHARGE_DISPOSITION_VALUE: "{Location} : -{0}%",
        RCM_AC_PLATELET_AG_CURRENT_LBL: "Platelet Aggregate Currently",
        RCM_AC_PLATELET_AG_HISTORY_LBL: "Platelet Aggregate History",        
        RCM_AC_POLYPHARMACY_LBL: "Polypharmacy",
        RCM_PIPE: " | ",
        RCM_POST_ACUTE_FACILITY: "Post-Acute Facility:",
        RCM_POWERCHART: "Powerchart.exe",
        RCM_PREVIOUS_ADMISSION_INFO: "Previous Admission",
        RCM_PRIMARY_PAYER_PLAN: "Primary Payer/Plan:",
        RCM_PRIMARY_SORT: "Primary: ",
        RCM_PRINT: "Print",
        RCM_PRINT_FAILED: "Error generating report",
        RCM_PRINT_FAILED_MESSAGE: "Error generating report. Please try again.",
        RCM_PRINT_WORKLIST_TOO_MANY:"The selected patient list contains a large amount of patients. It may take several minutes to process. Would you like to continue?",
        RCM_PRINT_WORKLIST_TOO_MANY_TITLE:"Print Worklist",
        RCM_READMISSION: "Readmitted:",
        RCM_READMISSION_ALERT: "Readmission Alert",
        RCM_READMISSION_RISK: "Readmission Risk",
        RCM_READMISSION_RISK_SCORE: "Readmission Risk Score",
        RCM_RELATIONSHIP_ERROR_MESSAGE_PART_ONE: " does not have authority to be assigned as the ",
        RCM_RELATIONSHIP_ERROR_MESSAGE_PART_TWO: ".  Select someone else.",
        RCM_RELATIONSHIP_ERROR_TITLE: "Relationship cannot be Established",
        RCM_REMOVE: "Remove",
        RCM_REMOVE_NOTE: "Are you sure you want to remove this note?  It will be removed from the system.",
        RCM_RISK_OF_MORTALITY: "ROM:",
        RCM_SAVE: "Save",
        RCM_SAVE_CONFIGURATION: "Save configuration as default",
        RCM_SAVE_FAILED: "Unable to Save",
        RCM_SAVE_FAILED_MESSAGE: "The system was unable to save. Try again.",
        RCM_SECONDARY_PAYER_INSURANCE: "Secondary Payer/Plan:",
        RCM_SECONDARY_SORT: "Secondary: ",
        RCM_SECURED:"Secured",
        RCM_SEVERITY_OF_ILLNESS: "SOI:",
        RCM_SHOW_DETAILS: "Show Details",
        RCM_SHOW_UNASSIGNED_WITH_ORDER: "Include unassigned w/ discharge or consult order",
        RCM_AC_SNF_ADMIT_SOURCE_LBL:"SNF",
        RCM_SLASH: " / ",
        RCM_SORTING: "Sorting",
        RCM_SSN: "SSN",
        RCM_STALE_DATA_MESSAGE: "The encounter selected has been updated since opening the current session.  It cannot be saved until the data has been refreshed.  Reload the Discharge Worklist to view the updates and continue modifications.",
        RCM_STALE_DATA_TITLE: "Unable to Save",
        RCM_STATUS: "Discharge Status",
        RCM_SUB_PAYER: "(Class)",
        RCM_TASK: "Task:",
        RCM_TASK_COMMENTS: "Task Comments:",
        RCM_TASK_DATE: "Task Date:",
        RCM_TASK_STATUS: "Status:",
        RCM_TASK_TYPE: "Type:",
        RCM_TERTIARY_SORT: "Tertiary: ", 
        RCM_TODAY: "Today",
        RCM_TOMORROW: "Tomorrow",
        RCM_TYPE: "Type",
        RCM_UM_INFO: "Utilization Management",
        RCM_UNASSIGNED: "Unassigned",    
        RCM_UNASSIGNED_WITH_ORDER: "Discharge or Consult Orders with no assigned relationship",        
        RCM_UNITS_DAYS: " days ",
        RCM_UNITS_HRS: " hrs ",
        RCM_UP_TO_TODAY: "Up to today",
        RCM_UP_TO_TOMORROW: "Up to tomorrow",
        RCM_UP_TO_TWO: "Up to 2 days from now",
        RCM_UP_TO_THREE: "Up to 3 days from now",
        RCM_UP_TO_FOUR: "Up to 4 days from now",
        RCM_UP_TO_FIVE: "Up to 5 days from now",
        RCM_UP_TO_SIX: "Up to 6 days from now",
        RCM_UP_TO_SEVEN: "Up to 7 days from now",
        RCM_AC_UTILITY_HDR:"Utility",
        RCM_UTILIZATION_MANAGEMENT_STATUS: "Utilization Management Status:",
        RCM_VIEW_ALL_VISITS: "View All Visits",
        RCM_VISIT_LENGTH: "Visit Length",
        RCM_VISIT_REASON: "Visit Reason",
        RCM_VISIT_SUB_LENGTH: "(Actual LOS / Expected LOS)",
        RCM_VISIT_SUB_REASON: "(Type | Med Service / Attending{0})",
        RCM_WORKING_DRG: "Working Group:",
        RCM_WORKING_DX: "Working Dx:",
        RCM_YES: "Yes",
        RCM_YESTERDAY: "Yesterday"
    };
}();
var rcm_auth_ribbon_i18n=function(){return{RCM_AUTH_END:"Auth end:",RCM_AUTH_END_DATE:"Auth End Date:",RCM_AUTH_STATUS:"Auth Status:",RCM_COMMA:",",RCM_DASH:"-",RCM_DAYS:"days",RCM_DOUBLE_DASH:"--",RCM_ELOS:"ELOS:",RCM_ERROR:"#ERR",RCM_EXCEEDED:"Exceeded",RCM_EXCEEDED_ELOS:"Exceeded ELOS",RCM_HOURS:"hours",RCM_LOS:"LOS:",RCM_PDD:"PDD:",RCM_PRIMARY:"Primary",RCM_QUATERNARY:"Quaternary",RCM_SECONDARY:"Secondary",RCM_TERTIARY:"Tertiary"};
}();
/**
 * @author RM023573
 * Contains all of the i18n key/value pairs used within the rcm_clinical_util.
 */
var rcm_clinical_util_i18n = function() {
	return {
		EXPAND_ALL: "Expand All",
		COLLAPSE_ALL:"Collapse All"
	}
}();var rcm_search_i18n=function(){return{PROV_SEARCH_DETAILS_ORGS:"Organizations: ",PROV_SEARCH_DETAILS_POSITIONS:"Positions: ",PROV_SEARCH_DETAILS_SERVICES:"Services: ",PROV_SEARCH_MORE_ORGS_AVAILABLE:"...",NO_RESULTS_FOUND:"No results found"};
}();
if(typeof MPAGE_LC=="undefined"){var MPAGE_LC={};
}MPAGE_LC.en_US={decimal_point:".",thousands_sep:",",grouping:"3",time24hr:"HH:MM:ss",time24hrnosec:"HH:MM",shortdate2yr:"m/d/yy",fulldate2yr:"mm/dd/yy",fulldate4yr:"mm/dd/yyyy",fullmonth4yrnodate:"mm/yyyy",full4yr:"yyyy",fulldatetime2yr:"mm/dd/yy HH:MM",fulldatetime4yr:"mm/dd/yyyy HH:MM",fulldatetimenoyr:"mm/dd h:MM TT"};
MPAGE_LC.en_AU={decimal_point:".",thousands_sep:",",grouping:"3",time24hr:"HH:MM:ss",time24hrnosec:"HH:MM",shortdate2yr:"d/m/yy",fulldate2yr:"dd/mm/yy",fulldate4yr:"dd/mm/yyyy",fullmonth4yrnodate:"mm/yyyy",full4yr:"yyyy",fulldatetime2yr:"dd/mm/yy HH:MM",fulldatetime4yr:"dd/mm/yyyy HH:MM",fulldatetimenoyr:"dd/mm h:MM TT"};
MPAGE_LC.en_GB={decimal_point:".",thousands_sep:",",grouping:"3",time24hr:"HH:MM:ss",time24hrnosec:"HH:MM",shortdate2yr:"d/m/yy",fulldate2yr:"dd/mm/yy",fulldate4yr:"dd/mm/yyyy",fullmonth4yrnodate:"mm/yyyy",full4yr:"yyyy",fulldatetime2yr:"dd/mm/yy HH:MM",fulldatetime4yr:"dd/mm/yyyy HH:MM",fulldatetimenoyr:"dd/mm h:MM TT"};
