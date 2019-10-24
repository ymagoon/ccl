/**
 * Locale file for the formatting utilized across all English locales.
 * Locales supported:
 * Spanish � Spain (Modern) (es-es)
 * 
 * Locales available for support:
 * Spanish - Spain (Traditional)
 * Spanish - Argentina (es-ar)
 * Spanish - Bolivia (es-bo
 * Spanish - Chile (es-cl)
 * Spanish - Colombia (es-co)
 * Spanish - Costa Rica (es-cr)
 * Spanish - Dominican Republic (es-do)
 * Spanish - Ecuador (es-ec)
 * Spanish - Guatemala (es-gt)
 * Spanish - Honduras (es-hn)
 * Spanish - Mexico (es-mx)
 * Spanish - Nicaragua (es-ni)
 * Spanish - Panama (es-pa)
 * Spanish - Peru (es-pe)
 * Spanish - Puerto Rico (es-pr)
 * Spanish - Paraguay (es-py)
 * Spanish - El Salvador (es-sv)
 * Spanish - Uruguay (es-uy)
 * Spanish - Venezuela (es-ve)
 */
if (typeof MPAGE_LC == "undefined") 
    var MPAGE_LC = {};

MPAGE_LC.es_ES = {
    "decimal_point": ",",
    "thousands_sep": ".",
    "grouping": "3",
    
    // Some common date/time format strings (formats for usage with date.format.js)
    time24hr: "HH:MM:ss",
    time24hrnosec: "HH:MM",
    shortdate2yr: "d/m/yy",
    fulldate2yr: "dd/mm/yy",
    fulldate4yr: "dd/mm/yyyy",
    fullmonth4yrnodate: "mm/yyyy",
    full4yr: "yyyy",
    fulldatetime2yr: "dd/mm/yy HH:MM",
    fulldatetime4yr: "dd/mm/yyyy HH:MM",
    fulldatetimenoyr: "dd/mm h:MM TT"
};
﻿
if (typeof i18n == "undefined") //do not internationalize this line
    var i18n = {};

/**
 * NOTE: DO NOT ADD ADDITIONAL ITEMS TO THIS OBJECT
 * @deprecated
 */
i18n = {
    REQUEST: "Solicitud",
    //Return Status:
    NO_RESULTS_FOUND: "No se encuentran resultados",
    NO_DATA: "Sin datos",
    
    //Error Status:
    ERROR_RETREIVING_DATA: "Error al recuperar los resultados",
    ERROR_OPERATION: "Nombre de operación",
    ERROR_OPERATION_STATUS: "Estado de operación",
    ERROR_TARGET_OBJECT: "Nombre del objeto de destino",
    ERROR_TARGET_OBJECT_VALUE: "Valor del objeto de destino",
    //Customization
    CLEAR_PREFERENCES: "Borrar preferencias",
    SAVE_PREFERENCES: "Guardar preferencias",
    CUSTOMIZE: "Personalizar",
    USER_CUSTOMIZATION: "Personalización de usuario",
    SAVE_PREF_SUCCESS: "Las preferencias se guardaron correctamente",
    CLEAR_PREF_SUCCESS: "Las preferencias se borraron correctamente",
    
    //Commons
    GO_TO_TAB: "Ir a la ficha {0}",
    ESTIMATED_DISCHARGE_DATE: "Fecha de alta estimada",
    LOADING_DATA: "Cargando",
    RENDERING_DATA: "Representación",
    NAME: "Nombre",
    DETAILS: "Detalles",
    ONSET_DATE: "Fecha de comienzo",
    COMMENTS: "Comentarios",
    DATE_TIME: "Fecha/hora",
    ANNOTATED_DISPLAY: "Nombre de visualización anotada",
    ANNOTATED_DISPLAY_NAME: "Visualización anotada",
    ARRIVAL: "Llegada",
    CODE: "Código",
    LATEST: "Último",
    WITHIN: "en",
    PREVIOUS: "Anterior",
    SINCE: "Desde",
    DISCLAIMER: "Esta página no es una fuente completa de información sobre la visita.",
    USER_CUST_DISCLAIMER: "Tenga en cuenta la resolución de pantalla antes de seleccionar una visualización de tres columnas.",
    RESULT: "Resultado",
    STATUS: "Estado",
    DATE: "Fecha",
    ACTIVE: "Activo",
    ENTERED: "Introducido",
    FLAGGED: "Marcado",
    DISCONTINUED: "Interrumpido",
    ADMIN_LAST_N_HOURS: "Administrado las últimas {0} horas",
    LAST_N_HOURS: "Últimas {0} horas",
    LAST_N_DAYS: "Últimos {0} días",
    LAST_N_MONTHS: "Últimos {0} meses",
    LAST_N_YEARS: "Últimos {0} años",
    LAST_N_WEEKS: "Últimas {0} semanas",
    NEXT_N_HOURS: "Próximas {0} horas",
    WITHIN_MINS: "{0} min",
    WITHIN_HOURS: "{0} h",
    WITHIN_DAYS: "{0} días",
    WITHIN_WEEKS: "{0} sem",
    WITHIN_MONTHS: "{0} mes",
    WITHIN_YEARS: "{0} añ",
    SELECTED_VISIT: "Visita seleccionada",
    All_VISITS: "Todas las visitas",
    SELECTED_N_VISIT: "{0} para la visita seleccionada",
    ALL_N_VISITS: "{0} para todas las visitas",
    PRIMARY_RESULTS: "Resultados principales",
    SECONDARY_RESULTS: "Resultados secundarios",
    FROM: "Desde",
    COLLECTED: "Tomada",
    DONE: "Listo",
    NOT_DONE: "No realizado",
    HELP: "Ayuda",
    ADD: "Agregar",
    TEXT: "Texto",
    //Errors
    JS_ERROR: "Error de JavaScript",
    DISCERN_ERROR: "Error de Discern",
    MESSAGE: "Mensaje",
    NUMBER: "Número",
    DESCRIPTION: "Descripción",
    //expand collapse
    SHOW_SECTION: "Expandir",
    HIDE_SECTION: "Contraer",
    EXPAND_ALL: "Expandir todo",
    COLLAPSE_ALL: "Contraer todo",
    LOCATION: "Ubicación",
    //Demographic	
    DOB: "Fecha de nacimiento",
    SEX: "Sexo",
    AGE: "Edad",
    MRN: "NºHªC",
    FIN: "Nº de episodio",
    VISIT_REASON: "Razón de visita",
    ISOLATION: "Aislamiento",
    LAST_DOC_DT_TM: "Última fecha/hora documentada",
    LAST_DOC_BY: "Última documentación por",
    
    
    //Allergy
    ALLERGY: "Alergia",
    ALLERGY_NAME: "Nombre de alergia",
    REACTION: "Reacción",
    SEVERITY: "Gravedad",
    
    //Diagnoses
    DIAGNOSES: "Diagnóstico",
    DIAGNOSES_NAME: "Nombre de diagnóstico",
    DIAGNOSES_DATE: "Fecha de diagnóstico",
    
    //Problems
    PROBLEM: "Problema",
    PROBLEMS: "Problemas",
    PROBLEMS_NAME: "Nombre de problema",
    PROBLEMS_DETAILS: "Detalles de problemas",
    RESPONSIBLE_PROVIDER_NAME: "Profesional asistencial responsable",
    
    //intake and output
    TOTAL_FL_INTAKE: "Aporte hídrico total",
    TOTAL_FL_OUTPUT: "Egreso hídrico total",
    TOTAL_FL_BAL: "Balance hídrico total",
    IO: "Balance hídrico",
    LAST_3_DAYS: "Últimos 3 días para la visita seleccionada",
    NOTE_INDICATOR: "* Indica un día sin un período de medición de 24 horas completo.",
    
    //Growth Chart
    PERCENTILE: "Percentil",
    ZSCORE: "Puntuación Z",
    
    //Vitals & Labs
    VITALS_TABLE: "Tabla de constantes vitales",
    BLOOD_PRESSURE: "Tensión arterial",
    OTHER_RESULTS: "Otros resultados",
    TEMPERATURE: "Temperatura",
    DEGC: "Grados C",
    DEGF: "Grados F",
    HEART_RATE: "H",
    MIN: "Mín",
    MAX: "Máx",
    NORMAL_RANGE: "Intervalo normal",
    CRITICAL_RANGE: "Intervalo crítico",
    NORMAL_LOW: "Bajo normal",
    NORMAL_HIGH: "Alto normal",
    CRITICAL_LOW: "Bajo crítico",
    CRITICAL_HIGH: "Alto crítico",
    HI_IND: "H",
    LOW_IND: "L",
    CRIT_IND: "C",
    UNIT_OF_MEASURE: "Unidad de medida",
    TWO_DAY_MAX: "Máximo 48 horas",
    //graph
    CLOSE_X: "CERRAR X",
    LABRAD: "Laboratorio/Radiología",
    
    //Restraints
    RESTRAINTS: "Sujeciones",
    RESTRAINT: "Sujeción",
    RESTRAINT_APPLIED: "Sujeción aplicada",
    RESTRAINT_TYPE: "Tipo de sujeción",
    RESTRAINT_LOCATION: "Ubicación de sujeción",
    RESTRAINT_DEATILS: "Detalles de sujeción",
    RESTRAINT_REASON: "Razón de sujeción",
    ORDER_TYPE: "Tipo de indicación",
    ORDER_DATE_TIME: "Fecha/hora de indicación",
    EXPIRATION_DATE_TIME: "Fecha/hora de vencimiento",
    
    //Documents
    DOCUMENTATION_DETAILS: "Detalles de documentación",
    NOTE_NAME: "Nombre de nota",
    SUBJECT: "Asunto",
    NOTE_TYPE: "Tipo de nota",
    AUTHOR: "Autor",
    DOCUMENT_FAVS: "No se encuentran favoritos",
    DOCUMENTS: "Documentos",
    //Overdue Tasks
    OVERDUE_TASKS: "Tareas vencidas",
    
    //measurements and weights
    MEASUREMENT_DETAILS: "Detalles de medición",
    
    //Patient Assessment
    PATIENT_ASSESSMENT: "Evaluación del paciente",
    PSYCHOSOCIAL_FACTORS: "Factores psicosociales",
    RESPIRATORY: "Respiratorio",
    CARDIO: "Cardiovascular",
    PAIN: "Dolor",
    NEURO: "Neurología",
    GI: "GI",
    GU: "GU",
    MUSCULOSKELETAL: "Musculoesquelético",
    INTEGUMENTARY: "Tegumentario",
    GENERAL_ASSESSMENT: "Evaluación general",
    
    //Patient Family Education
    PATIENT_FAMILY_EDUCATION_DETAILS: "Detalles de educación para la familia del paciente",
    PATIENT_FAMILY_EDUCATION: "Educación para la familia del paciente",
    
    //Diagnostics
    DIAGNOSTIC: "Diagnóstico",
    DIAGNOSTIC_DETAILS: "Detalles de diagnóstico",
    STUDY: "Estudio",
    EKG: "ECG",
    CHEST: "Tórax",
    OTHER_DIAGNOSTICS: "Otros diagnósticos",
    CHEST_ABD_XR: "Radiografía de tórax/abdomen",
    
    //Respiratory
    MODEL: "Modelo",
    DATE_TIME_INITIATED: "Fecha/hora iniciada",
    VENTILATOR_MODE: "Modo de respirador",
    SET_TIDAL_VOLUME: "Establecer volumen corriente",
    PEEP: "PEEP",
    FIO2: "FiO2",
    SET_RATE: "Establecer frecuencia",
    FLOW_RATE: "Frecuencia del flujo",
    TOTAL_RESPIRATORY_RATE: "Frecuencia respiratoria total",
    TOTAL_MINUTE_VOLUME: "Volumen respiratorio por minuto total",
    INSPIRATORY_TIME_SET: "Tiempo de inspiración",
    INSPIRATORY_TIME_DELIVERED: "% de tiempo de inspiración",
    RESPIRATORY_DISCLAIMER: "Los resultados de la gasometría arterial mostrados deben estar sincronizados con la fuente de oxígeno de FiO2, y/o el flujo de oxígeno administrado al paciente en el momento en que se obtuvo la muestra.",
    UNKNOWN: "Desconocido",
    BE: "E.B.",
    PREVIOUS_ABG_RESULTS: "Resultados previos de gasometría arterial",
    LATEST_ABG_RESULTS: "Últimos resultados de gasometría arterial",
    VENTILATOR_INFO: "Información sobre respirador",
    NO_RES_LAST_24_HRS: "-- No se encuentran resultados para las últimas 24 horas --",
    NO_PREV_RES_LAST_24_HRS: "-- No se encuentran resultados previos para las últimas 24 horas --",
    NO_RES_LAST_LOOKBACK_HRS: "--No hay resultados en el periodo de recuerdo--",
    
    //Blood Info
    TRANSFUSIONS: "Transfusiones",
    BLOOD_TYPE_RH: "RH de tipo de sangre",
    MOTHER: "Madre",
    BABY: "Bebé",
    PHOTOTHERAPY: "Fototerapia",
    PHOTOTHERAPY_RESULT: "Resultado",
    TRANSFUSION_RESULT_VAL: "Valor del resultado",
    TRANSFUSION_DATE: "Fecha de transfusión",
    TRANSFUSION_EVENT_CD: "Event code de transfusión",
    
    
    //Medications
    MEDICATIONS: "Medicación",
    MED_DETAIL: "Detalles de medicación",
    MED_NAME: "Medicación",
    REQUESTED_START: "Inicio solicitado",
    ORIG_DT_TM: "Fecha/hora de indicación original",
    LAST_DOSE_DT_TM: "Última dosis",
    NEXT_DOSE_DT_TM: "Dosis siguiente",
    START_DT_TM: "Fecha/hora de inicio",
    STOP_DT_TM: "Fecha/hora de finalización",
    STOP_REASON: "Razón de finalización",
    STATUS: "Estado",
    LAST_GIVEN: "Última administración",
    NEXT_DOSE: "Dosis siguiente",
    SCHEDULED: "Programado",
    CONTINOUS: "Continuo",
    SUSPENDED: "Suspendido",
    PRN: "A demanda",
    UNSCHEDULED: "No programado",
    RESPONSIBLE_PROVIDER: "Indicación escrita por",
    COMPLIANCE: "Cumplimiento",
    SCHEDULED_INH: "Inhalado programado",
    PRN_ALL: "Todo a demanda",
    PRN_48: "Administrado a demanda en las últimas 48 horas",
    INHALED: "Inhalación",
    NEBULIZED: "Nebulizador",
    INHALALATION: "Inhalación",
    HI_FLOW_NEB: "Nebulizador de alto flujo",
    ADMINISTERED: "Administrado",
    PRN_UNSCHEDULED: "A demanda/No programado disponible",
    //Orders
    ORDER_DETAILS: "Detalles de indicación",
    ORDER_NAME: "Indicación",
    ORDER_DATE: "Fecha/hora de indicación",
    ORDER_STATUS: "Estado",
    ORDER_PHYS: "Indicado por",
    DISCONTINUED: "Interrumpido",
    ORDERED: "Indicada",
    CLINICAL_DISPLAY: "Visualización clínica",
    ORDERS: "Indicaciones",
    
    //Weights and Measurements
    MEASUREMENT_DETAILS: "Detalles de medición",
    CHANGE: "Cambiar",
    ADMISSION: "Admisión",
    
    //Patient Information
    RFV: "Razón de la visita",
    ROOM_BED: "Habitación/Cama",
    ADMIT_DIAG: "Diagnóstico de admisión",
    ADMIT_DATE: "Fecha de admisión",
    PRIM_PHYS: "Médico principal",
    ATTEND_PHYS: "Médico encargado",
    EMER_CONTACT: "Contacto de emergencia",
    EMER_NUMBER: "Nº de emergencia",
    CODE_STATUS: "Estado de código",
    LAST_VISIT: "Última visita",
    LAST: "Última",
    VISIT: "Visita",
    CONTACTS: "Contactos",
    
    //Micro
    SOURCE_BODY_SITE: "Origen/zona del cuerpo",
    COLLECTED_DATE_TIME: "Fecha/hora de toma",
    SUSCEPTIBILITY: "Susceptibilidad",
    ASSOCIATED_MICRO_REPORTS: "Informes de microbiología asociados",
    ASSOCIATED_MICRO_STAIN_REPORTS: "Informes de tinción microbiológica asociados",
    GROWTH_IND: "Ind. de crecimiento",
    SUSC_HEADER: "SC",
    POS: "Pos",
    NEG: "Neg",
    GROWTH: "Crecimiento",
    NO_GROWTH: "Sin crecimiento",
    NORMALITY: "Normalidad",
    SOURCE_SITE: "Origen/zona",
    SOURCE: "Origen",
    COLLECTED_WITHIN: "Toma dentro de",
    MICRO: "Micro",
    
    //Patient Background
    ADVANCE_DIRECTIVE: "Avanzar directiva",
    ISOLATION: "Aislamiento",
    ACTIVITY_ORDER: "Indicación de actividad",
    FALL_RISK_SCORE: "Escala de riesgo de caídas",
    SEIZURE_PRECAUTIONS: "Precauciones ante convulsiones",
    DIET: "Dieta",
    PAIN_SCORE: "Escala del dolor",
    GESTATIONAL_AGE: "Edad gestacional",
    PARA_GRAVIDA: "Partos/embarazos",
    TRANSPLANT_DATE: "Fecha de trasplante",
    CODE_STATUS: "Estado de código",
    SERVICE: "Servicio",
    ATTENDING_PHYSICIAN: "Médico encargado",
    PARENT_PART_TYPE: "Relación del tutor legal",
    TARGET_DISCH_DT_TM: "Fecha/hora de alta límite",
    CARE_LEVEL: "Nivel de cuidados",
    RESUSITATION_STATUS: "Estado de reanimación",
    ASSISTIVE_DEVICES: "Tecnología asistencial",
    MULTIPLE: "Múltiple",
    DEVICE_DETAILS: "Detalles de dispositivo",
    
    //Lines Tubes Drains,
    LINES: "Líneas",
    TUBES_DRAINS: "Sondas/drenajes",
    LAST_DOC_DT_TM: "Última fecha/hora documentada",
    INIT_DOC_DT_TM: "Fecha/hora inicial documentada",
    LAST_DOC: "Documentado por última vez",
    LAST_DOC_WITHIN: "Documentado por última vez en",
    
    //EVENTS
    EVENTS: "Eventos",
    
    //Timeline Misc
    ACTIVITY_LIST: "Lista de actividades",
    INCOMPLETE_ORDERS: "Indicaciones incompletas",
    RESULTS_RETURNED: "Resultados devueltos",
    COMPLETE_ORDERS: "Indicaciones completas",
    MEDS_ADMINISTERED: "Medicación administrada",
    CRITICAL_RESULTS: "Resultados críticos",
    FIRST_24HRS_ED_VISIT: "Los resultados representan las primeras 24 horas de la visita a Urgencias",
    RESULTS_SINCE_ADMITTED: "Resultados desde la hora de admisión",
    HIDE_LEGEND: "Ocultar leyenda",
    SHOW_LEGEND: "Mostrar leyenda",
    COMPLETED: "Completado",
    EXAM: "Examen",
    ADMINISTERED: "Administrado",
    NO_RESULTS: "Sin resultados",
    LAST_PARTICIPATION: "Última participación",
    //Nursing Communication MPage specific strings
    SITUATION_BACKGROUND: "Situación/antecedentes",
    ASSESSMENT: "Evaluación",
    RECOMMENDATION: "Recomendación",
    NURSING_COMMUNICATION: "Comunicación de enfermería",
    
    //MPage title strings
    ED_SUMMARY: "Resumen de DU", //ED Summary v2
    ICU_SUMMARY: "Resumen de UCI", //ICU Summary
    INPATIENT_SUMMARY: "Resumen de paciente interno", //Inpatient Summary v2
    DISCHARGE_SUMMARY: "Resumen de alta",
    
    
    //Oxygenation and Ventilation Component
    O2_FLOW_RATE: "Frecuencia de flujo de O2",
    PREVIOUS_BLOOD_GAS_ARTERIAL_RESULTS: "Resultados previos de gases sanguíneos arteriales",
    LATEST_BLOOD_GAS_ARTERIAL_RESULTS: "Resultados más recientes de gases sanguíneos arteriales",
    
    
    //Blood Group Component
    TRANSFUSIONS: "Transfusiones",
    DATE_PERFORMED: "Fecha de realización",
    
    //Care Manager UM Page Name
    CAREMANAGERUMPAGE: "Resumen de revisión de utilización",
    
    //Dicharge Care Management Summary
    DISCHARGECAREMANAGEMENT: "Resumen de gestión de cuidados de alta",
    
    //Care Manager Discharge Planning
    CUR_DOC_PLAN_SCREEN: "Plan/evaluación documentada actual",
    PLANNED_DISCHARGE_DISP: "Disposición de alta planificada",
    TRANSPORATION_ARRANGED: "Transporte organizado",
    LOCATION: "Ubicación",
    TRANSFER_OF_CARE_PACKET: "Traslado de paquete de cuidados",
    MIM_SIGNED: "Documento de derechos firmado en admisión",
    DISCHARGE_MIM_SIGNED: "Se otorgó documento de derechos al alta",
    DISCHARE_APPEALDELIVERED: "Se entregó apelación de alta",
    DME_ANTICIPATED: "Se anticipó equipo médico duradero",
    DME_COORD: "Se coordinó equipo médico duradero",
    PLANNED_DISCHARGE_DT_TM: "Fecha de alta planificada",
    DC_PLANNING_TM_TRACKED: "Hora de planificación de alta con seguimiento",
    DELAYS_TRACKED: "Retrasos con seguimiento",
    DISCHARGE_PLANNER: "Planificador de altas",
    HOURS: "Horas",
    MINS: "Minutos",
    DAYS: "Días",
    PROFSKILLEDSERVICESANTICIPATED: "Se anticiparon servicios profesionales",
    
    //Care Manager Insurance Strings
    PRIMARY: "Principal",
    SECONDARY: "Secundario",
    TERTIARY: "Terciario",
    
    AUTHORIZATION: "Autorización",
    TYPE: "Tipo",
    STATUS: "Estado",
    DELAYREASON: "Razón de retraso",
    AUTH: "Auto",
    AUTHDATES: "Fechas auto",
    NUMBEROFDAYS: "Número de días",
    AUTHCOMMENTS: "Comentarios de auto",
    
    BENEFITS: "Ventajas",
    DEDUCTIBLE: "Deducible",
    DEDUCTIBLE_MET: "Cumple",
    REMAINING: "Restante",
    COPAY: "Copago",
    LIFETIMEMAX: "Duración máx",
    LTRDAYSREMAINING: "Días restantes de la reserva vitalicia",
    LTRDAILYDEDUCTABLE: "Franquicia diaria de rehabilitación a largo plazo",
    COVEREDDAYSREMAINING: "Días restantes con cobertura",
    COINSURANCEDAYSREMAINING: "Días de coaseguro restantes",
    //Care Manager Visit Information Strings
    FIN_NUM: "Nº de episodio clínico",
    ENCNTR_TYPE: "Tipo de episodio clínico",
    FIN_CLASS: "Clase financiera",
    
    ADMIT_INFO: "Información de admisión",
    REG_DT_TM: "Fecha/hora de registro",
    ADMIT_TO_BED_DT: "Fecha de admisión en cama",
    ATTENDING_PHD: "Médico encargado",
    REASON_FOR_VISIT: "Razón de la visita",
    ADMIT_DX: "Diagnóstico de admisión",
    ADMIT_SOURCE: "Origen de admisión",
    LOCATION: "Ubicación",
    
    DISCHARGE_INFORMATION: "Información de alta",
    DISCHARGE_DATE: "Fecha de alta",
    DISCHARGE_DISPOSITION: "Disposición de alta",
    DISCHARGE_LOCATION: "Ubicación de alta",
    
    ENCOUNTERS: "Episodios clínicos",
    FINAL_DRG: "GD final",
    FINAL_DIAGNOSIS: "Diagnóstico final",
    ADMIT_DATE: "Fecha de admisión",
    LOS: "Nivel de servicio",
    LENGTH_OF_STAY: "Duración de la estancia",
    KEY_PERSON_RELATIONSHIPS: "Relaciones con paciente clave",
    NO_KEY_PERSONS: "No se encuentran pacientes clave",
    RELATIONSHIP_HEADER: "Relación",
    PERSON_NAME_HEADER: "Nombre de paciente",
    
    ADMIT_DATE: "Fecha de admisión",
    FINAL_DIAGNOSIS: "Diagnóstico final",
    
    //Home medication
    HOME_MEDICATION: "Medicación domiciliaria",
    LAST_DOSE: "Última dosis",
    PRESCRIBED: "Prescrito",
    DOCUMENTED: "Documentado",
    NO_KNOWN_HOME_MEDS: "No hay medicación domiciliaria conocida para este paciente.",
    UNABLE_TO_OBTAIN_MED_HIST: "No se puede obtener la información del historial de medicación para la visita seleccionada.",
    
    //Procedure History
    PROCEDURE: "Procedimiento",
    DISPLAY_AS: "Mostrar como",
    PROCEDURE_DETAILS: "Detalles de procedimiento",
    PROCEDURE_DATE: "Fecha de procedimiento",
    PROVIDER: "Profesional asistencial",
    SIG_LINE: "SIG Línea",
    
    //Procedural Information
    MODIFIERS: "Modificadores",
    CASE_NUM: "Número de caso",
    ANESTHESIA_TYPE: "Tipos de anestesia",
    SURGEON: "Cirujano",
    SURGERY_START: "Inicio de cirugía",
    SURGERY_STOP: "Finalización de cirugía",
    ANESTH_STOP: "Finalización de anestesia",
    ANESTH_START: "Inicio de anestesia",
    SECONDARY_PROCEDURE: "Procedimiento secundario",
    PROCEDURE_NAME: "Nombre de procedimiento",
    SURGICAL_FREE_TEXT: "Texto libre para cirugía",
    
    //Social History
    SOCIAL_HISTORY_INFORMATION: "Información de historial social",
    SOCIAL_HISTORY_DETAILS: "Detalles de historial social",
    CATEGORY: "Categoría",
    LAST_UPDATED: "Última actualización",
    LAST_UPDATED_BY: "Última actualización por",
    
    
    //Pregnancy History
    PREGNANCY: "Embarazo",
    BABY: "Bebé",
    PREGNANCY_DETAILS: "Detalles de embarazo",
    LENGTH_OF_LABOR: "Duración del parto",
    DELIVERY_HOSPITAL: "Hospital de partos",
    CHILD_NAME: "Nombre del bebé",
    FATHER_NAME: "Nombre del padre",
    
    //Family history
    CONDITION: "Condición",
    MEMBERS: "Miembros",
    DECEASED: "Fallecido",
    
    //Past Medical History
    PAST_RESOLVED_DATE: "Fecha de resolución",
    PAST_PROBLEM: "Problema",
    
    
    //Notes and Reminders
    PRIORITY: "Prioridad",
    SHOW_UP: "Presentado",
    DUE: "Vencido",
    STICKY_NOTES: "Notas adhesivas",
    REMINDERS: "Recordatorios",
    
    //Plan of Care
    POC_SUMMARY: "Resumen de plan de cuidados",
    PLAN_NAME: "Nombre de plan",
    STATUS_DATE: "Fecha/hora de estado",
    LAST_EVALUATION: "Última evaluación",
    DOCUMENTED_VARIANCE: "Razón de varianza documentada",
    DOCUMENTED_ACTION: "Acción de varianza documentada",
    REASON: "Razón",
    ACTION: "Acción",
    NOTE: "Nota",
    ERROR_OCCURED: "Se produjo un error",
    SIGN_FAILED: "Error al firmar",
    DISPLAY_MET: "Mostrar resultados cumplidos",
    BTN_HVR: "Hacer clic para documentar varianza",
    SIGN: "Firmar",
    CANCEL: "Cancelar",
    OF: "de",
    MET: "cumple",
    NO_SUPPORT_CHARACTERS: "Actualmente no se admiten los caracteres ^ y $.",
    
    //Ventilator Settings (RT)
    VENT_MODEL: "Modelo de respirador/máquina",
    VENT_ID: "Id. de respirador/máquina",
    VENT_MODE: "Modo de respirador",
    SETTINGS: "Configuración",
    SETTINGS_DETAILS: "Detalles de configuración",
    RESULT_DETAILS: "Detalles de resultado",
    RESULT_DT_TM: "Fecha/hora de resultado",
    DOCUMENTED_BY: "Documentado por",
    RESP_RATE_TOTAL: "Frecuencia respiratoria total",
    MEASUREMENTS_ASSESSMENTS: "Mediciones y evaluaciones",
    MEASUREMENTS_ASSESSMENTS_DETAILS: "Detalles de mediciones y evaluaciones",
    VENT_ALARMS_ON: "Alarmas resp., activadas y funcionales",
    ALARM_SETTINGS: "Configuración de alarma",
    ALARM_SETTINGS_DETAILS: "Detalles de configuración de alarma",
    WEANING_PARAMETERS: "Parámetros de retirada",
    WEANING_PARAMETERS_DETAILS: "Detalles de parámetros de retirada",
    
    //Respiratory Assessments (RT)
    LATEST_BLOOD_GAS_ARTERIAL: "Última gasometría arterial",
    PREVIOUS_BLOOD_GAS_ARTERIAL: "Gasometría arterial previa",
    ARTIFICIAL_AIRWAY: "Vía respiratoria artificial",
    ARTIFICIAL_AIRWAY_DETAILS: "Detalles de vía respiratoria artificial",
    O2_THERAPY_TITRATION: "Oxigenoterapia/dosis de oxígeno",
    O2_THERAPY_TITRATION_DETAILS: "Detalles de oxigenoterapia/dosis de oxígeno",
    BREATH_SOUNDS_ASSESSMENT: "Evaluación de murmullo vesicular",
    BREATH_SOUNDS_ASSESSMENT_DETAILS: "Detalles de evaluación de murmullo vesicular",
    RESPIRATORY_DESCRIPTION: "Descripción respiratoria",
    RESPIRATORY_DESCRIPTION_DETAILS: "Detalles de descripción respiratoria",
    NO_RES: "-- No se encuentran resultados --",
    NO_PREV_RES: "-- No se encuentran resultados previos --",
    
    //Respiratory Treatments (RT)
    AEROSOL_THERAPY: "Respuesta del paciente a medicación inhalada",
    AEROSOL_THERAPY_DETAILS: "Detalles de respuesta del paciente a medicación inhalada",
    INCENTIVE_SPIROMETRY: "Espirometría de incentivo",
    INCENTIVE_SPIROMETRY_DETAILS: "Detalles de espirometría de incentivo",
    COUGH_SUCTION: "Aspiración de secreción bronquial",
    COUGH_SUCTION_DETAILS: "Detalles de aspiración de secreción bronquial",
    CHEST_PHYSIOTHERAPY: "Higiene bronquial",
    CHEST_PHYSIOTHERAPY_DETAILS: "Detalles de higiene bronquial",
    
    //Timeline View (ICU and RT)
    MASTER_GRAPH: "Gráfico maestro",
    RESP_MONITORING: "Monitorización respiratoria",
    ALL_DATA: "Todos los datos",
    A_LINE: "Catéter intraarterial",
    CUFF: "Manguito del esfigmomanómetro",
    SBP: "Tensión arterial sistólica",
    DBP: "Tensión arterial diastólica",
    MAP: "Tensión arterial media",
    BP_UNIT: "(mmHg)",
    CURRENT: "Actual",
    RESET: "Restablecer zoom",
    ACCORDING_TO_ZOOM: "&nbsp;(el intervalo depende del zoom)",
    NO_ZOOM_APPLIED: "Sin zoom aplicado",
    TABLE_GRAPH_DISCLAIMER: "Los últimos valores documentados aparecen en la tabla para el intervalo de tiempo indicado.",
    JANUARY: ["Ene", "Enero"],
    FEBRUARY: ["Feb", "Febrero"],
    MARCH: ["Mar", "Marzo"],
    APRIL: ["Abr", "Abril"],
    MAY: ["Mayo", "Mayo"],
    JUNE: ["Jun", "Junio"],
    JULY: ["Jul", "Julio"],
    AUGUST: ["Ago", "Agosto"],
    SEPTEMBER: ["Sep", "Septiembre"],
    OCTOBER: ["Oct", "Octubre"],
    NOVEMBER: ["Nov", "Noviembre"],
    DECEMBER: ["Dic", "Diciembre"],
    
    //patient information.
    RFV: "Razón de la visita",
    ROOM_BED: "Habitación-Cama",
    ADMIT_DIAG: "Diagnóstico de admisión",
    ADMIT_PHYS: "Médico responsable de la admisión",
    PRIM_PHYS: "Médico principal",
    ATTEND_PHYS: "Médico encargado",
    EMER_CONTACT: "Contactos de emergencia",
    EMER_NUMBER: "Nº de emergencia",
    CHIEF_COMPLAINT: "Queja principal",
    LAST_VISIT: "Última visita",
    MODE_OF_ARRVAL: "Modo de llegada",
    LAST: "Última",
    VISIT: "Visita",
    CONTACTS: "Contactos",
    TARGETED_DISCHARGE_DATE: "Fecha de alta meta",
    LAST_VISIT: "Última visita",
    
    //immunizations
    IMMUNIZATIONS: "Vacunas",
    PRODUCT: "Producto",
    ADMIN_DATE: "Fecha de administración",
    MANUFACTURER: "Fabricante",
    LOT: "Lote",
    EXP_DATE: "Fecha de vencimiento",
    ADMIN_NOTES: "Notas de administración",
    IMMUNIZATIONS_DETAILS: "Detalles de vacunas",
    
    //Meds Recon
    START: "Iniciar",
    STOP: "Detener",
    SIGNATURE_LINE: "Línea de firma",
    ORDERING_PHYSICIAN: "Médico que realiza la indicación",
    NEW: "Nuevo",
    CONTINUE: "Continuar",
    NO_LONGER_TAKING: "Ya no se está tomando",
    CONTINUE_WITH_CHANGES: "Continuar con los cambios",
    CONTACT_PHYSICIAN: "Póngase en contacto con el médico antes de tomarlo(a)",
    
    //Visits 
    FUTURE: "Futuro",
    VISIT_DETAILS: "Detalles de visita",
    
    DISCHARGE_PROCESS: "Proceso de alta",
    CLICK_TO_GO_TO_DISCHARGE_PROCESS: "Haga clic para ir al proceso de alta",
    
    // New Order Entry
    MEDS: "Medicación",
    LABS: "Laboratorios",
    IMAGING: "Imágenes",
    BILLING: "Facturación",
    OTHER: "Otros",
    ORDER_FAVORITE: "Favorito de indicación",
    ORDER_NAME: "Nombre de indicación",
    ORDER_DISPLAY_LINE: "Línea de visualización de indicación",
    ORDER_PARAMETERS: "Parámetros de indicación",
    NO_MEDS_FAVORITES: "No se encontró medicación favorita",
    NO_LABS_FAVORITES: "No se encontraron análisis de laboratorio favoritos",
    NO_IMAGING_FAVORITES: "No se encontraron creaciones de imágenes favoritas",
    NO_BILLING_FAVORITES: "No se encontraron facturaciones favoritas",
    NO_OTHER_FAVORITES: "No se encontraron otros favoritos",
    ORDERS_FOR_SIGNATURE: "Indicaciones para firmar",
    NO_ORDERS_FOR_SIGNATURE: "No hay indicaciones para firmar",
    SEARCH_MODE: "Modo de búsqueda",
    SELECT: "Seleccionar",
    SUBMIT_FOR_SIGNATURE: "Enviar para firmar",
    
    // Care Management Strings
    RCM_ACTUAL_DISCHARGE_DISPOSITION: "Disposición de alta real",
    RCM_ADD_ADDENDUM: "Agregar Addendum",
    RCM_ADDENDUM: "Addendum",
    RCM_ADDENDUM_BY: "Addendum por:",
    RCM_ADDITIONAL_NOTES: "Notas adicionales",
    RCM_ADDITIONAL_REVIEWER_NOTES: "Notas adicionales del revisor",
    RCM_ADM_MIM: "Documento de derechos en admisión",
    RCM_ADMIT_TO_BED_DT: "Fecha y hora de admisión en cama",
    RCM_ADMITTING_DX: "Diagnóstico de admisión",
    RCM_ADMITTING_DX_DESC: "Descripción de diagnóstico de admisión",
    RCM_ADMIT_DATE: "Fecha de admisión",
    RCM_ADMIT_SOURCE: "Origen de admisión",
    RCM_ADVANCE_DIR_COMPL: "Voluntades anticipadas completadas",
    RCM_ADVANCE_DIR_ON_FILE: "Voluntades anticipadas en archivo",
    
    RCM_AGE: "Edad",
    RCM_ALTERNATE_DRG: "DRG alternativo",
    RCM_ATTENDING_PHYSICIAN: "Médico encargado",
    RCM_AVOIDABLE_DAYS: "Días evitables",
    RCM_BED: "Cama",
    RCM_CANCEL: "Cancelar",
    RCM_CANCEL_MESSAGE: "¿Está seguro de que desea cancelar?  Se perderán todos los cambios.",
    RCM_CARE_GUIDELINE: "Directriz de cuidados",
    RCM_CARE_MANAGEMENT: "Gestión de cuidados",
    RCM_CLINICAL_REVIEW: "Revisión clínica",
    RCM_CLINICAL_REVIEW_ENTRY: "Entrada de revisión clínica",
    RCM_CLINICAL_REVIEW_SUMMARY: "Resumen de revisión clínica",
    RCM_COLON: ":",
    RCM_COMPLETE: "Completar",
    RCM_CONTINUED_STAY: "Estancia continua",
    RCM_CRITERIA_MET: "Criterios cumplidos",
    RCM_CURRENT_ENCOUNTER: "Episodio clínico actual",
    RCM_DATE: "Fecha",
    RCM_DATEPICKER_TEXT: "Elija una fecha",
    RCM_DAY_REVIEWED: "Día revisado",
    RCM_DELETE: "Eliminar revisión clínica",
    RCM_DELETE_FAILED: "Falló la eliminación",
    RCM_DELETE_FAILED_MESSAGE: "Otro usuario ha modificado la revisión clínica seleccionada desde su apertura.  No se puede eliminar la revisión clínica.",
    RCM_DELETE_MESSAGE: "¿Está seguro de que desea eliminar la revisión clínica seleccionada?",
    RCM_DELETE_REVIEW: "Eliminar revisión",
    RCM_DENIED_DAYS: "Días denegados",
    RCM_DISCHARGE_ASSESSMENT_INFO: "Información de evaluación de alta",
    RCM_DISCHARGE_BARRIERS: "Barreras de alta",
    RCM_DISCHARGE_DATE: "Fecha de alta",
    RCM_DISCHARGE_DISPOSITION: "Disposición de alta",
    RCM_DISCHARGE_FACILITY: "Centro de alta",
    RCM_DISCHARGE_NEXT_ASSESSMENT_DT: "Fecha y hora de evaluación siguiente de alta",
    RCM_DISCHARGE_OF_SERVICES: "Alta de servicios",
    RCM_DISCHARGE_PENDING: "Alta pendiente",
    RCM_DISCHARGE_SCREEN: "Evaluar al alta",
    RCM_DISCHARGE_SCREENING: "Evaluación al alta",
    RCM_DISCHARGE_SLOT: "Espacio de alta",
    RCM_DISPLAY: "Visualizar",
    RCM_DNR: "No reanimar",
    RCM_DOB: "Fecha de nacimiento",
    RCM_DONE: "Listo",
    RCM_DRG_DESC: "Desc. DRG",
    RCM_ELOS: "ELOS",
    RCM_ENCOUNTER_TYPE: "Tipo de episodio clínico",
    RCM_ESTIMATED_DISCHARGE_DATE: "Fecha de alta estimada",
    RCM_FACILITY: "Centro",
    RCM_FAX_REVIEWS: "Revisiones de fax",
    RCM_FC: "F/C",
    RCM_FIN: "Nº de episodio",
    RCM_FINAL: "Final",
    RCM_FINAL_AND_NEXT: "Final y siguiente",
    RCM_FINAL_DRG: "GD final",
    RCM_FINAL_DX: "Diagnóstico final",
    RCM_FINAL_PRIMARY_DX: "Diagnóstico principal final",
    RCM_FINANCIAL_CLASS: "Clase financiera",
    RCM_INCLUDE_CLOSED_UM_REVIEWS: "Incluir revisiones de gestión de utilización cerradas",
    RCM_INTENSITY_OF_SERVICES: "Intensidad de servicios",
    RCM_LAST_ASSESSMENT_DATE: "Fecha de última evaluación",
    RCM_LAST_REVIEW_DATE: "Fecha de última revisión",
    RCM_LEVEL_OF_SERVICE_SUBTYPE: "Subtipo de nivel de servicio",
    RCM_LOS: "Nivel de servicio",
    RCM_LOS_ELOS: "Duración de la estancia (LOS) / Duración de la estancia estimada (ELOS):",
    RCM_MARK_AS_FINAL: "Indicar como Final",
    RCM_MED_SERVICE: "Servicio médico",
    RCM_MET: "Cumple",
    RCM_MODIFY: "Modificar",
    RCM_MRN: "NºHªC",
    RCM_MY_RELATIONSHIP: "Mi relación",
    RCM_NAME: "Nombre",
    RCM_NEXT_CLINICAL_REVIEW: "La próxima revisión clínica se entregará el:",
    RCM_NEXT_CLINICAL_REVIEW_DATE: "Fecha de revisión clínica siguiente",
    RCM_NEXT_CL_REVIEW: "Revisión clínica siguiente",
    RCM_NEXT_REVIEW_NEEDED: "Se necesita revisión siguiente",
    RCM_NEXT_SECTION: "Siguiente sección",
    RCM_NO: "No",
    RCM_NOMENCLATUREID: "Id. de nomenclatura:",
    RCM_NOT_MET: "No cumplido",
    RCM_OBS_END_DTTM: "Fecha/hora de fin de observación",
    RCM_OBS_START_DTTM: "Fecha/hora de inicio de observación",
    RCM_OK: "Aceptar",
    RCM_OPEN_CLINICAL_REVIEW: "Abrir revisión clínica",
    RCM_OUTCOME: "Resultado",
    RCM_PATIENT_LIST: "Lista de pacientes",
    RCM_PAYER: "Pagador",
    RCM_PENDING: "Pendiente",
    RCM_PLANNED_DISCHARGE_DATE: "Fecha de alta planificada",
    RCM_PLANNED_DISCHARGE_DISPOSITION: "Disposición de alta planificada",
    RCM_PREVIOUS_ADMISSION_INFO: "Información de admisión previa",
    RCM_PRIMARY_DX: "Diagnóstico principal",
    RCM_PRIMARY_UR_NURSE: "Enfermero principal de UR",
    RCM_REASON_FOR_REFERRAL: "Razón de referencia",
    RCM_REVIEW: "Revisar",
    RCM_REVIEW_CRITERIA: "Criterios de revisión",
    RCM_REVIEW_DATE: "Fecha de revisión",
    RCM_REVIEW_DUE: "Revisión vencida",
    RCM_REVIEW_OUTCOME: "Revisar resultado",
    RCM_REVIW_TYPE: "Revisar tipo",
    RCM_REVIWED_BY: "Revisado por:",
    RCM_REVIEWER: "Revisor",
    RCM_ROOM: "Habitación",
    RCM_SAVE: "Guardar",
    RCM_SAVE_AND_NEW: "Guardar y nuevo",
    RCM_SAVE_FAILED: "Fallo al guardar",
    RCM_SAVE_FAILED_MESSAGE: "Otro usuario ha modificado la revisión clínica seleccionada desde su apertura.  No se pueden actualizar los cambios realizados a su revisión clínica.",
    RCM_SECONDARY_REVIEW: "Revisión secundaria",
    RCM_SECONDARY_REVIEW_NEEDED: "Se necesita revisión secundaria",
    RCM_SEVERITY_OF_ILLNESS: "Gravedad de la enfermedad",
    RCM_SOURCE_IDENTIFIER: "Identificador de origen:",
    RCM_SR_DATE: "Fecha de revisión secundaria",
    RCM_SR_STATUS: "Estado de revisión secundaria",
    RCM_SSN: "NSS",
    RCM_STATUS: "Estado",
    RCM_TYPE: "Tipo",
    RCM_UM_INFO: "Información de gestión de utilización",
    RCM_UM_STATUS: "Estado de gestión de utilización",
    RCM_UNIT: "Unidad",
    RCM_UNIT_DISCHARGE_FROM: "Alta de unidad de",
    RCM_UTILIZATION_MANAGEMENT: "Administración de utilización",
    RCM_VISIT_INFO: "Información de visita",
    RCM_WORKING_DRG: "DRG de trabajo",
    RCM_WORKING_DRG_DESC: "Descripción de DRG de trabajo",
    RCM_YES: "Sí",
    
    // Discharge Readiness
    DC_NOT_STARTED: "No iniciado",
    DC_IN_PROGRESS: "En curso",
    DC_COMPLETE: "Completar",
    DC_REVIEWSIGN: "Revisar y firmar",
    
    //Follow Up
    FU_NAME: "Nombre:",
    FU_ADDRESS: "Dirección:",
    
    //Patient Education
    PE_INSTRUCTION: "Instrucción:",
    PE_DATE: "Fecha:",
    PE_PROVIDER: "Profesional asistencial:",
    
    //Quality Measures
    QM_COMPLETE: "Completar",
    QM_INCOMPLETE: "Incompleto",
    QM_CONDITION: "Estado:"
};

/*
 * Core namespace for architecture i18n string utilized.
 * NOTE: Keep alpha sorted to eliminate the error of duplicate strings
 */
i18n.discernabu = {
    ADD: "Agregar",
    ALL_N_VISITS: "{0} para todas las visitas",
    All_VISITS: "Todas las visitas",
    CLEAR_PREFERENCES: "Borrar preferencias",
    COLLAPSE_ALL: "Contraer todo",
    CUSTOMIZE: "Personalizar",
    DESCRIPTION: "Descripción",
    DISCERN_ERROR: "Error de Discern",
    DISCLAIMER: "Esta página no es una fuente completa de información sobre la visita.",
    ERROR_OPERATION: "Nombre de operación",
    ERROR_OPERATION_STATUS: "Estado de operación",
    ERROR_RETREIVING_DATA: "Error al recuperar los resultados",
    ERROR_TARGET_OBJECT: "Nombre del objeto de destino",
    ERROR_TARGET_OBJECT_VALUE: "Valor del objeto de destino",
    EXPAND_ALL: "Expandir todo",
    GO_TO_TAB: "Ir a la ficha {0}",
    HELP: "Ayuda",
    HIDE_SECTION: "Contraer",
    JS_ERROR: "Error de JavaScript",
    LAST_N_DAYS: "Últimos {0} días",
    LAST_N_HOURS: "Últimas {0} horas",
    LAST_N_MONTHS: "Últimos {0} meses",
    LAST_N_WEEKS: "Últimas {0} semanas",
    LAST_N_YEARS: "Últimos {0} años",
    LOADING_DATA: "Cargando",
    MESSAGE: "Mensaje",
    NAME: "Nombre",
    NO_RESULTS_FOUND: "No se encuentran resultados",
    NUMBER: "Número",
    RENDERING_DATA: "Representación",
    REQUEST: "Solicitud",
    SAVE_PREFERENCES: "Guardar preferencias",
    SELECTED_N_VISIT: "{0} para la visita seleccionada",
    SELECTED_VISIT: "Visita seleccionada",
    SHOW_SECTION: "Expandir",
    STATUS: "Estado",
    USER_CUSTOMIZATION: "Personalización de usuario",
    USER_CUST_DISCLAIMER: "Tenga en cuenta la resolución de pantalla antes de seleccionar una visualización de tres columnas.",
    WITHIN_DAYS: "{0} días",
    WITHIN_HOURS: "{0} h",
    WITHIN_MINS: "{0} min",
    WITHIN_MONTHS: "{0} mes",
    WITHIN_WEEKS: "{0} sem",
    WITHIN_YEARS: "{0} añ",
    X_DAYS: "{0} días",
    X_HOURS: "{0} hora(s)",
    X_MINUTES: "{0} minuto(s)",
    X_MONTHS: "{0} mes(es)",
    X_WEEKS: "{0} semana(s)",
    X_YEARS: "{0} año(s)",
    
    //Auto Suggest Control
    NO_PRIVS: "No tiene privilegios para agregar el/la {name} seleccionado(a)",
    DUPLICATE: "Esta acción crearía un(a) {name} duplicado(a). No tiene la habilidad para agregar este(a) {name}.",
    PROBLEM: "Problema",
    DIAGNOSIS: "Diagnóstico",

    DAYNAMES: ["Dom", "Lun", "Mar", "Miér", "Jue", "Vier", "Sáb", "domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
    MONTHNAMES: ["Ene.", "Feb.", "Mar.", "Abr.", "May.", "Jun.", "Jul.", "Ago.", "Sep.", "Oct.", "Nov.", "Dic.", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
}
/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */
 
var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};
 
	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;
 
		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}
 
		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");
 
		mask = String(dF.masks[mask] || mask || dF.masks["default"]);
 
		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}
 
		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};
 
		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();
 
// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "dd/m/yy",
	shortDate2:     "dd/mm/yyyy",
	shortDate3:		"dd/mm/yy",
	shortDate4:		"mm/yyyy",
	shortDate5:		"yyyy",
	mediumDate:     "d mmm, yyyy",
	longDate:       "d mmmm, yyyy",
	fullDate:       "dddd, d mmmm, yyyy",
	shortTime:      "HH:MM",
	mediumTime:     "HH:MM:ss",
	longTime:       "HH:MM:ss Z",
	militaryTime:   "HH:MM",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
	longDateTime: 	"dd/mm/yyyy HH:MM:ss Z",
	longDateTime2:	"dd/mm/yy HH:MM",
	longDateTime3:	"dd/mm/yyyy HH:MM",
	shortDateTime:	"dd/mm HH:MM"
};
 
// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Dom.", "Lun.", "Mar.", "Mi�.", "Jue.", "Vie.", "S�b.",
		"Domingo", "Lunes", "Martes", "Mi�rcoles", "Jueves", "Viernes", "S�bado"
	],
	monthNames: [
		"Ene.", "Feb.", "Mar.", "Abr.", "May.", "Jun.", "Jul.", "Ago.", "Sep.", "Oct.", "Nov.", "Dic.",
		"Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
	]
};
 
// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};
 
// For i18n formatting...
Date.prototype.setISO8601 = function (string) {
    var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
        "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
        "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
    var d = string.match(new RegExp(regexp));
 
    var offset = 0;
    var date = new Date(d[1], 0, 1);
 
    if (d[3]) { date.setMonth(d[3] - 1); }
    if (d[5]) { date.setDate(d[5]); }
    if (d[7]) { date.setHours(d[7]); }
    if (d[8]) { date.setMinutes(d[8]); }
    if (d[10]) { date.setSeconds(d[10]); }
    if (d[12]) { date.setMilliseconds(Number("0." + d[12]) * 1000); }
    if (d[14]) {
        offset = (Number(d[16]) * 60) + Number(d[17]);
        offset *= ((d[15] == '-') ? 1 : -1);
    }
 
    offset -= date.getTimezoneOffset();
    time = (Number(date) + (offset * 60 * 1000));
    this.setTime(Number(time));
};
﻿
/**
 * Project: i18n.js (diagnoses)
 * Version 1.3.2-SNAPSHOT
 * Released TBD
 * @author Mark Davenport (MD019066)
 */
if (typeof i18n == "undefined") 
    var i18n = {};

if (typeof i18n.discernabu == "undefined") 
    i18n.discernabu = {};

i18n.discernabu.diagnoses_o1 = {
	DIAGNOSES: "Diagnóstico",
	CODE: "Código",
	DETAILS: "Detalles",
	DIAGNOSES_DATE: "Fecha de diagnóstico",
	RESPONSIBLE_PROVIDER_NAME: "Profesional asistencial responsable",
	DIAG_TYPE: "Tipo de diagnóstico",
	COMMENTS: "Comentarios",
	DIAGNOSES_NAME: "Nombre de diagnóstico",
	ANNOTATED_DISPLAY: "Visualización anotada"
};
﻿/**
 * Project: i18n.js (Document Base)
 * Version 2.1.0-SNAPSHOT
 * Released TBD
 * @author Subash Katageri (SK018948)
 */
if (typeof i18n == "undefined") 
    var i18n = {};

if (typeof i18n.discernabu == "undefined") 
    i18n.discernabu = {};

i18n.discernabu.documents_base_o1 = {
    AUTHOR: "Autor",
    DATE: "Fecha",
    DATE_TIME: "Fecha/hora",
    WITHIN: "en",
    UNKNOWN: "Desconocido",
    DOCUMENTATION_DETAILS: "Detalles de documentación",
    NAME: "Nombre",
    SUBJECT: "Asunto",
    STATUS: "Estado",
    LAST_UPDATED: "Última actualización",
    LAST_UPDATED_BY: "Última actualización por",
    DOCUMENT_FAVS: "No se encuentran favoritos"
};
﻿/**
 * Project: i18n.js (Growth Chart)
 * Version 1.4.0-SNAPSHOT
 * Released TBD
 * @author Sreenivasan Thirumalachar (ST017230)
 */

if (typeof i18n == "undefined") 
    var i18n = {};

if (typeof i18n.discernabu == "undefined") 
    i18n.discernabu = {};

i18n.discernabu.gc_o1 = {
	PERCENTILE: "Percentil",
	ZSCORE: "Puntuación Z",
    LATEST: "Último",
    WITHIN: "en",
    PREVIOUS: "Anterior",
	RESULT_DETAILS: "Detalles de resultado",
	RESULT_DT_TM: "Fecha/hora de resultado",
	AGE: "Edad",
	RESULT: "Resultado"
}﻿
/**
 * Project: i18n.js (Home Medication)
 * Version 1.4.0 -SNAPSHOT
 * Released 01/10/2011
 * @author Sreenivasan Thirumalachar (ST017230)
 * @author Subash Katageri (SK018948)
 */
if (typeof i18n == "undefined") 
    var i18n = {};

if (typeof i18n.discernabu == "undefined") 
    i18n.discernabu = {};

i18n.discernabu.homemeds_o1 = {
    HOME_MEDICATION: "Medicación domiciliaria",
    LAST_DOSE: "Última dosis",
    PRESCRIBED: "Prescrito",
    DOCUMENTED: "Documentado",
    NO_KNOWN_HOME_MEDS: "No hay medicación domiciliaria conocida para este paciente.",
    UNABLE_TO_OBTAIN_MED_HIST: "No se puede obtener la información del historial de medicación para la visita seleccionada.",
    MED_DETAIL: "Detalles de medicación",
    ORDER_DATE: "Fecha de indicación",
    COMPLIANCE: "Cumplimiento",
    RESPONSIBLE_PROVIDER: "Indicación escrita por",
    STATUS: "Estado",
    TYPE: "Tipo",
    DETAILS: "Detalles",
    LAST_DOC_DT_TM: "Última fecha/hora documentada",
    LAST_DOC_BY: "Última documentación por",
    ORDER_DETAILS: "Detalles de indicación"
}
﻿/**
 * Project: i18n.js (laboratory)
 * Version 1.2.0
 * Released 11/10/2010
 * @author Greg Howdeshell (GH7199)
 */
if (typeof i18n == "undefined") 
    var i18n = {};

if (typeof i18n.discernabu == "undefined") 
    i18n.discernabu = {};

i18n.discernabu.laboratory_o1 = {
    WITHIN: "en",
    LATEST: "Último",
    PREVIOUS: "Anterior",
    EXPAND: "Expandir",
    COLLAPSE: "Contraer",
    PRIMARY_RESULTS: "Resultados principales",
    VALUE: "Valor",
    LABORATORY_DETAILS: "Detalles de laboratorio",
    DATE_TIME: "Fecha/hora",
    NORMAL_LOW: "Bajo normal",
    NORMAL_HIGH: "Alto normal",
    CRITICAL_LOW: "Bajo crítico",
    CRITICAL_HIGH: "Alto crítico"
};
﻿/**
 * Project: i18n.js (medications)
 * Version 1.4.0 -SNAPSHOT
 * Released TBD
 * @author Mark Davenport (MD019066)
 * @author Subash Katageri (SK018948)
 */
if (typeof i18n == "undefined") 
    var i18n = {};

if (typeof i18n.discernabu == "undefined") 
    i18n.discernabu = {};

i18n.discernabu.medications_o1 = {
    NEXT_N_HOURS: "Próximas {0} horas",
	HIDE_SECTION: "Contraer",
	SCHEDULED: "Programado",
    MED_DETAIL: "Detalles de medicación",
    MED_NAME: "Medicación",
    REQUESTED_START: "Inicio solicitado",
    ORIG_DT_TM: "Fecha/hora de indicación original",
    LAST_DOSE_DT_TM: "Última dosis",
    NEXT_DOSE_DT_TM: "Dosis siguiente",
    STOP_DT_TM: "Fecha/hora de finalización",
    STOP_REASON: "Razón de finalización",
    STATUS: "Estado",
    LAST_GIVEN: "Última administración",
    NEXT_DOSE: "Dosis siguiente",
    CONTINOUS: "Continuo",
    SUSPENDED: "Suspendido",
    PRN: "A demanda",
    UNSCHEDULED: "No programado",
    RESPONSIBLE_PROVIDER: "Indicación escrita por",
    ADMINISTERED: "Administrado",
    PRN_UNSCHEDULED: "A demanda/No programado disponible",
	ADMIN_LAST_N_HOURS: "Administrado las últimas {0} horas",
 	SHOW_SECTION: "Expandir",
	LAST_N_HOURS: "Últimas {0} horas",
	DISCONTINUED: "Interrumpido",
	JS_ERROR: "Error de JavaScript",
    MESSAGE: "Mensaje",
    NUMBER: "Número",
    DESCRIPTION: "Descripción",
	NAME: "Nombre",
	DETAILS: "Detalles",
	NOT_DEFINED: "No definido",
	ORDER_DETAILS: "Detalles de indicación"
};﻿
/**
 * Project: i18n.js (Patient Information)
 * Version 1.3.0
 * Released 01/07/2011
 * @author Sreenivasan Thirumalachar (ST017230)
 */
if (typeof i18n == "undefined") {
    var i18n = {};
}

if (typeof i18n.discernabu == "undefined") {
    i18n.discernabu = {};
}

i18n.discernabu.patinfo_o1 = {
    NO_RESULTS_FOUND: "No se encuentran resultados",
    RFV: "Razón de la visita",
    ROOM_BED: "Habitación/Cama",
    ADMIT_DIAG: "Diagnóstico de admisión",
    ADMIT_DATE: "Fecha de admisión",
    PRIM_PHYS: "Médico principal",
    ATTEND_PHYS: "Médico encargado",
    EMER_CONTACT: "Contacto de emergencia",
    EMER_NUMBER: "Nº de emergencia",
    CODE_STATUS: "Estado de código",
    LAST_VISIT: "Última visita",
    LAST: "Última",
    VISIT: "Visita",
    CONTACTS: "Contactos",
    ADMIT_PHYS: "Médico responsable de la admisión",
    TARGETED_DISCHARGE_DATE: "Fecha de alta meta",
    SERVICE: "Servicio",
    MODE_OF_ARRVAL: "Modo de llegada",
    ADVANCE_DIRECTIVE: "Avanzar directiva",
    DETAILS: "Detalles",
    CHIEF_COMPLAINT: "Queja principal"
};
﻿/**
 * Project: i18n.js (Vital signs)
 * Version 1.2.0-SNAPSHOT
 * Released TBD
 * @author Sreenivasan Thirumalachar (ST017230)
 */

if (typeof i18n == "undefined") 
    var i18n = {};

if (typeof i18n.discernabu == "undefined") 
    i18n.discernabu = {};

i18n.discernabu.vitals_o1 = {
    BLOOD_PRESSURE: "Tensión arterial",
    TEMPERATURE: "Temperatura",
    DEGC: "Grados C",
    DEGF: "Grados F",
    NORMAL_LOW: "Bajo normal",
    NORMAL_HIGH: "Alto normal",
    CRITICAL_LOW: "Bajo crítico",
    CRITICAL_HIGH: "Alto crítico",
    TWO_DAY_MAX: "Máximo 48 horas",
    LATEST: "Último",
    WITHIN: "en",
    PREVIOUS: "Anterior",
    DATE_TIME: "Fecha/hora",
    ERROR_RETREIVING_DATA: "Error al recuperar los resultados",
    VALUE: "Valor",
    LABORATORY_DETAILS: "Detalles de laboratorio"
}