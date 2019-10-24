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
dateFormat.masks={"default":"ddd dd.mm.yyyy HH:MM:ss",shortDate:"d.m.yy",shortDate2:"dd.mm.yyyy",shortDate3:"dd.mm.yy",shortDate4:"mm.yyyy",shortDate5:"yyyy",mediumDate:"d. mmm. yyyy",longDate:"d. mmmm yyyy",fullDate:"dddd, d. mmmm yyyy",shortTime:"HH:MM",mediumTime:"HH:MM:ss",longTime:"HH:MM:ss Z",militaryTime:"HH:MM",isoDate:"yyyy-mm-dd",isoTime:"HH:MM:ss",isoDateTime:"yyyy-mm-dd'T'HH:MM:ss",isoUtcDateTime:"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",longDateTime:"dd.mm.yyyy HH:MM:ss Z",longDateTime2:"dd.mm.yy HH:MM",longDateTime3:"dd.mm.yyyy HH:MM",shortDateTime:"dd.mm. HH:MM"};
dateFormat.i18n={dayNames:["SO","MO","DI","MI","DO","FR","SA","Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],monthNames:["Jan","Feb","M�r","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez","Januar","Februar","M�rz","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"]};
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
}MPAGE_LC.de_DE={decimal_point:",",thousands_sep:".",grouping:"3",time24hr:"HH:MM:ss",time24hrnosec:"HH:MM",shortdate2yr:"d.m.yy",fulldate2yr:"dd.mm.yy",fulldate4yr:"dd.mm.yyyy",fullmonth4yrnodate:"mm.yyyy",full4yr:"yyyy",fulldatetime2yr:"dd.mm.yy HH:MM",fulldatetime4yr:"dd.mm.yyyy HH:MM",fulldatetimenoyr:"dd.mm h:MM TT"};
if(typeof i18n=="undefined"){var i18n={};}
i18n.RCM_CALENDAR_LOCALIZATION = "de";
//set to true for 24 hour format and false when 12 hour format
i18n.SET24HOUR = true;
if(typeof i18n=="undefined"){var i18n={};
}i18n.ACCORDING_TO_ZOOM="&nbsp;(Bereich abhängig vom Zoom)";
i18n.ACTION="Aktion";
i18n.ACTIVE="Aktiv";
i18n.ACTIVITY_LIST="Aktivitätsliste";
i18n.ACTIVITY_ORDER="Aktivitätsanforderung";
i18n.ADD="Hinzufügen";
i18n.ADMINISTERED="Verabreicht";
i18n.ADMIN_DATE="Verabreichungsdatum";
i18n.ADMIN_LAST_N_HOURS="Innerhalb der letzten {0} Stunden verabreicht";
i18n.ADMIN_NOTES="Verabreichungshinweise";
i18n.ADMISSION="Aufnahme";
i18n.ADMIT_DATE="Aufnahmedatum";
i18n.ADMIT_DIAG="Aufnahmediagnose";
i18n.ADMIT_DX="Aufnahmediagnose";
i18n.ADMIT_INFO="Aufnahmeinformation";
i18n.ADMIT_PHYS="Aufnahmearzt";
i18n.ADMIT_SOURCE="Aufnahmeherkunft";
i18n.ADMIT_TO_BED_DT="Datum der Aufnahme mit Bettenzuweisung";
i18n.ADVANCE_DIRECTIVE="Vorausverfügung";
i18n.AEROSOL_THERAPY="Reaktion des Patienten auf inhalierte Medikationen";
i18n.AEROSOL_THERAPY_DETAILS="Reaktion des Patienten auf inhalierte Medikationen - Details";
i18n.AGE="Alter";
i18n.ALARM_SETTINGS="Einstellungen für Warnungen";
i18n.ALARM_SETTINGS_DETAILS="Einstellungen für Warnungen - Details";
i18n.ALLERGY="Allergie";
i18n.ALLERGY_NAME="Allergiename";
i18n.ALL_DATA="Alle Daten";
i18n.ALL_N_VISITS="{0} für alle Aufenthalte";
i18n.ANESTHESIA_TYPE="Anästhesietypen";
i18n.ANESTH_START="Beginn der Anästhesie";
i18n.ANESTH_STOP="Ende der Anästhesie";
i18n.ANNOTATED_DISPLAY="Name für Anzeige mit Annotationen";
i18n.ANNOTATED_DISPLAY_NAME="Anzeige mit Annotationen";
i18n.APRIL=["Apr","April"];
i18n.ARRIVAL="Ankunft";
i18n.ARTIFICIAL_AIRWAY="Künstliche Luftröhre";
i18n.ARTIFICIAL_AIRWAY_DETAILS="Künstliche Luftröhre - Details";
i18n.ASSESSMENT="Bewertung";
i18n.ASSISTIVE_DEVICES="Hilfsgeräte";
i18n.ASSOCIATED_MICRO_REPORTS="Zugewiesene Mikrobiologiebefunde";
i18n.ASSOCIATED_MICRO_STAIN_REPORTS="Zugewiesene Mikrobiologie-Anfärbungsbefunde";
i18n.ATTENDING_PHD="Behandelnder Arzt";
i18n.ATTENDING_PHYSICIAN="Behandelnder Arzt";
i18n.ATTEND_PHYS="Behandelnder Arzt";
i18n.AUGUST=["Aug","August"];
i18n.AUTH="Autorisiert";
i18n.AUTHCOMMENTS="Autorisierungskommentare";
i18n.AUTHDATES="Autorisierungsdaten";
i18n.AUTHOR="Verfasser";
i18n.AUTHORIZATION="Autorisierung";
i18n.A_LINE="Intraarterieller Katheter";
i18n.All_VISITS="Alle Aufenthalte";
i18n.BABY="Neugeborenes";
i18n.BABY="Neugeborenes";
i18n.BE="B.E.";
i18n.BENEFITS="Leistungen";
i18n.BILLING="Abrechnung";
i18n.BLOOD_PRESSURE="Blutdruck";
i18n.BLOOD_TYPE_RH="Blutgruppe/Rh";
i18n.BP_UNIT="(mmHg)";
i18n.BREATH_SOUNDS_ASSESSMENT="Bewertung der Atemgeräusche";
i18n.BREATH_SOUNDS_ASSESSMENT_DETAILS="Bewertung der Atemgeräusche - Details";
i18n.BTN_HVR="Klicken, um Abweichungen zu dokumentieren";
i18n.CANCEL="Abbrechen";
i18n.CARDIO="Kardiovaskulär";
i18n.CAREMANAGERUMPAGE="Übersicht zu Utilization Management";
i18n.CARE_LEVEL="Pflegestufe";
i18n.CASE_NUM="OP-Fallnummer";
i18n.CATEGORY="Kategorie";
i18n.CHANGE="Ändern";
i18n.CHEST="Thorax";
i18n.CHEST_ABD_XR="Röntgen Thorax/Abdomen";
i18n.CHEST_PHYSIOTHERAPY="Bronchialpflege";
i18n.CHEST_PHYSIOTHERAPY_DETAILS="Bronchialpflege - Details";
i18n.CHIEF_COMPLAINT="Hauptbeschwerde";
i18n.CHILD_NAME="Name des Kindes";
i18n.CLEAR_PREFERENCES="Voreinstellungen löschen";
i18n.CLEAR_PREF_SUCCESS="Die Voreinstellungen wurden erfolgreich gelöscht.";
i18n.CLICK_TO_GO_TO_DISCHARGE_PROCESS="Hier für Entlassungsverfahren klicken";
i18n.CLINICAL_DISPLAY="Klinische Anzeige";
i18n.CLOSE_X="Schließen X";
i18n.CODE="Kode";
i18n.CODE_STATUS="Code-Status";
i18n.COINSURANCEDAYSREMAINING="Verbleibende Tage mit Zweitversicherung";
i18n.COLLAPSE_ALL="Alle minimieren";
i18n.COLLECTED="Abgenommen";
i18n.COLLECTED_DATE_TIME="Abnahmedatum/ -zeit";
i18n.COLLECTED_WITHIN="Abgenommen innerhalb";
i18n.COMMENTS="Kommentare";
i18n.COMPLETED="Abgeschlossen";
i18n.COMPLETE_ORDERS="Abgeschlossene Anforderungen";
i18n.COMPLIANCE="Einhaltung";
i18n.CONDITION="Bedingung";
i18n.CONTACTS="Ansprechpartner";
i18n.CONTACT_PHYSICIAN="Vor der Einnahme ärztlichen Rat einholen";
i18n.CONTINOUS="Dauerinfusion";
i18n.CONTINUE="Weiter";
i18n.CONTINUE_WITH_CHANGES="Weiter mit Änderungen";
i18n.COPAY="Eigenbeteiligung";
i18n.COUGH_SUCTION="Absaugen nach Husten";
i18n.COUGH_SUCTION_DETAILS="Absaugen nach Husten - Details";
i18n.COVEREDDAYSREMAINING="Verbleibende abgedeckte Tage";
i18n.CRITICAL_HIGH="Kritischer Maximalwert";
i18n.CRITICAL_LOW="Kritischer Minimalwert";
i18n.CRITICAL_RANGE="Kritischer Bereich";
i18n.CRITICAL_RESULTS="Pathologische Ergebnisse";
i18n.CRIT_IND="Kritisch";
i18n.CUFF="Manschette";
i18n.CURRENT="Aktuell";
i18n.CUR_DOC_PLAN_SCREEN="Aktueller dokumentierter Plan bzw. Screening";
i18n.CUSTOMIZE="Anpassen";
i18n.DATE="Datum";
i18n.DATE_PERFORMED="Durchgeführt am";
i18n.DATE_TIME="Datum/Zeit";
i18n.DATE_TIME_INITIATED="Initiierungdatum/-zeit";
i18n.DAYS="Tage";
i18n.DBP="Diastolischer Blutdruck";
i18n.DC_COMPLETE="Abschließen";
i18n.DC_IN_PROGRESS="In Bearbeitung";
i18n.DC_NOT_STARTED="Nicht gestartet";
i18n.DC_PLANNING_TM_TRACKED="Zeit für Entlassungsplanung verfolgt";
i18n.DC_REVIEWSIGN="Überprüfen und Abzeichnen";
i18n.DECEASED="Verstorben";
i18n.DECEMBER=["Dez","Dezember"];
i18n.DEDUCTIBLE="Selbstbehalt";
i18n.DEDUCTIBLE_MET="Erreicht";
i18n.DEGC="Grad Celsius";
i18n.DEGF="Grad Fahrenheit";
i18n.DELAYREASON="Grund für Verzögerung";
i18n.DELAYS_TRACKED="Verzögerungen verfolgt";
i18n.DELIVERY_HOSPITAL="Krankenhaus für Entbindung";
i18n.DESCRIPTION="Beschreibung";
i18n.DETAILS="Details";
i18n.DEVICE_DETAILS="Geräte - Details";
i18n.DIAGNOSES="Diagnose";
i18n.DIAGNOSES_DATE="Diagnose - Datum";
i18n.DIAGNOSES_NAME="Diagnose - Name";
i18n.DIAGNOSTIC="Diagnostik";
i18n.DIAGNOSTIC_DETAILS="Diagnostik - Details";
i18n.DIET="Kost";
i18n.DISCERN_ERROR="Discern-Fehler";
i18n.DISCHARE_APPEALDELIVERED="Anfechtung der Entlassung gesendet";
i18n.DISCHARGECAREMANAGEMENT="Übersicht zur Pflege nach Entlassung";
i18n.DISCHARGE_DATE="Entlassungsdatum";
i18n.DISCHARGE_DISPOSITION="Entlassungszustand";
i18n.DISCHARGE_INFORMATION="Entlassungsinformationen";
i18n.DISCHARGE_LOCATION="Entlassungsort";
i18n.DISCHARGE_MIM_SIGNED="Dokument zu Patientenrechten bei Entlassung ausgehändigt";
i18n.DISCHARGE_PLANNER="Entlassungsplanung";
i18n.DISCHARGE_PROCESS="Entlassungsverfahren";
i18n.DISCHARGE_SUMMARY="Entlassungsübersicht";
i18n.DISCLAIMER="Diese Ansicht umfasst nicht alle Daten dieses Aufenthalts.";
i18n.DISCONTINUED="Abgesetzt";
i18n.DISPLAY_AS="Anzeigen als";
i18n.DISPLAY_MET="Erreichte Ziele anzeigen";
i18n.DME_ANTICIPATED="Voraussichtlich benötigte medizinische Hilfsmittel";
i18n.DME_COORD="Arrangierte medizinische Hilfsmittel";
i18n.DOB="Geburtsdatum";
i18n.DOCUMENTATION_DETAILS="Dokumentation - Details";
i18n.DOCUMENTED="Dokumentiert";
i18n.DOCUMENTED_ACTION="Dokumentierte Aktion für Abweichung";
i18n.DOCUMENTED_BY="Dokumentiert von";
i18n.DOCUMENTED_VARIANCE="Dokumentierte Grund für Abweichung";
i18n.DOCUMENTS="Dokumente";
i18n.DOCUMENT_FAVS="Keine Favoriten gefunden";
i18n.DONE="Erledigt";
i18n.DUE="Fällig";
i18n.ED_SUMMARY="Übersicht Notaufnahme";
i18n.EKG="EKG";
i18n.EMER_CONTACT="Ansprechpartner für Notfälle";
i18n.EMER_CONTACT="Ansprechpartner für Notfälle";
i18n.EMER_NUMBER="Telefonnummer für Notfälle";
i18n.EMER_NUMBER="Telefonnummer für Notfälle";
i18n.ENCNTR_TYPE="Falltyp";
i18n.ENCOUNTERS="Fälle";
i18n.ENTERED="Eingegeben";
i18n.ERROR_OCCURED="Es ist ein Fehler aufgetreten.";
i18n.ERROR_OPERATION="Operation";
i18n.ERROR_OPERATION_STATUS="Operationsstatus";
i18n.ERROR_RETREIVING_DATA="Fehler beim Suchen der Ergebnisse";
i18n.ERROR_TARGET_OBJECT="Zielobjekts";
i18n.ERROR_TARGET_OBJECT_VALUE="Wert des Zielobjekts";
i18n.ESTIMATED_DISCHARGE_DATE="Geschätztes Entlassungsdatum";
i18n.EVENTS="Events";
i18n.EXAM="Untersuchung";
i18n.EXPAND_ALL="Alle erweitern";
i18n.EXPIRATION_DATE_TIME="Ablaufdatum/-zeit";
i18n.EXP_DATE="Ablaufdatum";
i18n.FALL_RISK_SCORE="Fallrisikoskala";
i18n.FATHER_NAME="Name des Vaters";
i18n.FEBRUARY=["Feb","Februar"];
i18n.FIN="Fallnummer";
i18n.FINAL_DIAGNOSIS="Endgültige Diagnose";
i18n.FINAL_DRG="Endgültiger DRG";
i18n.FIN_CLASS="Buchungsklasse";
i18n.FIN_NUM="Fallnummer";
i18n.FIO2="FIO2";
i18n.FIRST_24HRS_ED_VISIT="Ergebnisse umfassen die ersten 24 Stunden in der Notaufnahme";
i18n.FLAGGED="Gekennzeichnet";
i18n.FLOW_RATE="Flussgeschwindigkeit";
i18n.FROM="Von";
i18n.FUTURE="In Zukunft";
i18n.FU_ADDRESS="Anschrift:";
i18n.FU_NAME="Name:";
i18n.GENERAL_ASSESSMENT="Allgemeine Einschätzung";
i18n.GESTATIONAL_AGE="Gestationsalter";
i18n.GI="Gastrointestinal";
i18n.GO_TO_TAB="Gehe zu Register {0}";
i18n.GROWTH="Wachstum";
i18n.GROWTH_IND="Wachstumsindikator";
i18n.GU="Urogenital";
i18n.HEART_RATE="Herzfrequenz";
i18n.HELP="Hilfe";
i18n.HIDE_LEGEND="Legende ausblenden";
i18n.HIDE_SECTION="Minimieren";
i18n.HI_FLOW_NEB="Vernebler mit schneller Flussgeschwindigkeit";
i18n.HI_IND="Hoch";
i18n.HOME_MEDICATION="Heimmedikation";
i18n.HOURS="Stunden";
i18n.ICU_SUMMARY="Übersicht für Intensivstation";
i18n.IMAGING="Bildgebende Verfahren";
i18n.IMMUNIZATIONS="Impfung";
i18n.IMMUNIZATIONS_DETAILS="Impfung - Details";
i18n.INCENTIVE_SPIROMETRY="Reizspirometrie";
i18n.INCENTIVE_SPIROMETRY_DETAILS="Reizspirometrie - Details";
i18n.INCOMPLETE_ORDERS="Unvollständige Anforderungen";
i18n.INHALALATION="Inhalation";
i18n.INHALED="Inhalator";
i18n.INIT_DOC_DT_TM="Ursprünglich dokumentiert am/um";
i18n.INPATIENT_SUMMARY="Übersicht stationärer Patient";
i18n.INSPIRATORY_TIME_DELIVERED="Einatmungszeit %";
i18n.INSPIRATORY_TIME_SET="Einatmungszeit einrichten";
i18n.INTEGUMENTARY="Integumentäres System";
i18n.IO="Einfuhr und Ausfuhr";
i18n.ISOLATION="Isolierung";
i18n.ISOLATION="Isolierung";
i18n.JANUARY=["Jan","Januar"];
i18n.JS_ERROR="JavaScript-Fehler";
i18n.JULY=["Jul","Juli"];
i18n.JUNE=["Jun","Juni"];
i18n.KEY_PERSON_RELATIONSHIPS="Schlüsselbeziehungen mit Personen";
i18n.LABRAD="Labor/Radiologie";
i18n.LABS="Labortests";
i18n.LAST="Letzte(r)";
i18n.LAST_3_DAYS="Letzte 3 Tage des ausgewählten Aufenthalts";
i18n.LAST_DOC="Zuletzt dokumentiert";
i18n.LAST_DOC_BY="Zuletzt dokumentiert von";
i18n.LAST_DOC_DT_TM="Zuletzt dokumentiert am/um";
i18n.LAST_DOC_DT_TM="Zuletzt dokumentiert am/um";
i18n.LAST_DOC_WITHIN="Zuletzt dokumentiert innerhalb";
i18n.LAST_DOSE="Letzte Dosis";
i18n.LAST_DOSE_DT_TM="Letzte Dosis";
i18n.LAST_EVALUATION="Letzte Auswertung";
i18n.LAST_GIVEN="Zuletzt verabreicht";
i18n.LAST_N_DAYS="Letzte {0} Tage";
i18n.LAST_N_HOURS="Letzte {0} Stunden";
i18n.LAST_N_MONTHS="Letzte {0} Monate";
i18n.LAST_N_WEEKS="Letzte{0} Wochen";
i18n.LAST_N_YEARS="Letzte {0} Jahre";
i18n.LAST_PARTICIPATION="Letzte Teilnahme";
i18n.LAST_UPDATED="Zuletzt aktualisiert";
i18n.LAST_UPDATED_BY="Zuletzt aktualisiert von";
i18n.LAST_VISIT="Letzter Aufenthalt";
i18n.LATEST="Letzte/r/s";
i18n.LATEST_ABG_RESULTS="Letzte ABG-Ergebnisse";
i18n.LATEST_BLOOD_GAS_ARTERIAL="Letzte arterielle Blutgasanalyse";
i18n.LATEST_BLOOD_GAS_ARTERIAL_RESULTS="Ergebnisse aus letzter arterieller Blutgasanalyse";
i18n.LENGTH_OF_LABOR="Dauer der Geburtswehen";
i18n.LENGTH_OF_STAY="Aufenthaltsdauer";
i18n.LIFETIMEMAX="Maximum über Lebensdauer";
i18n.LINES="Zeilen";
i18n.LOADING_DATA="Ladevorgang";
i18n.LOCATION="Standort";
i18n.LOS="Aufenthaltsdauer";
i18n.LOT="Charge";
i18n.LOW_IND="Niedrig";
i18n.LTRDAILYDEDUCTABLE="Täglicher Eigenanteil für Langzeitrehabilitation";
i18n.LTRDAYSREMAINING="Verbleibende Tage - Lebensversicherung";
i18n.MANUFACTURER="Hersteller";
i18n.MAP="Mittlerer arterieller Blutdruck";
i18n.MARCH=["Mär","März"];
i18n.MASTER_GRAPH="Hauptgrafik";
i18n.MAX="Max.";
i18n.MAY=["Mai","Mai"];
i18n.MEASUREMENTS_ASSESSMENTS="Messungen und Bewertungen";
i18n.MEASUREMENTS_ASSESSMENTS_DETAILS="Messungen und Bewertungen - Details";
i18n.MEASUREMENT_DETAILS="Messung - Details";
i18n.MEASUREMENT_DETAILS="Messung - Details";
i18n.MEDICATIONS="Medikationen";
i18n.MEDS="Medikamente";
i18n.MEDS_ADMINISTERED="Verabreichte Medikationen";
i18n.MED_DETAIL="Medikationen - Details";
i18n.MED_NAME="Medikation";
i18n.MEMBERS="Mitglieder";
i18n.MESSAGE="Nachricht";
i18n.MET="erreicht";
i18n.MICRO="Mikrobiologie";
i18n.MIM_SIGNED="Dokument zu Patientenrechten bei Aufnahme unterschrieben";
i18n.MIN="Min.";
i18n.MINS="Minuten";
i18n.MODEL="Modell";
i18n.MODE_OF_ARRVAL="Ankunftsmodus";
i18n.MODIFIERS="Modifikatoren";
i18n.MOTHER="Mutter";
i18n.MRN="Patientennummer";
i18n.MULTIPLE="Mehrfach";
i18n.MUSCULOSKELETAL="Muskuloskeletal";
i18n.NAME="Name";
i18n.NEBULIZED="Vernebler";
i18n.NEG="Negativ";
i18n.NEURO="Neurologisch";
i18n.NEW="Neu";
i18n.NEXT_DOSE="Nächste Dosis";
i18n.NEXT_DOSE_DT_TM="Nächste Dosis";
i18n.NEXT_N_HOURS="In den nächsten {0} Stunden";
i18n.NORMALITY="Normalzustand";
i18n.NORMAL_HIGH="Obergrenze Normalbereich";
i18n.NORMAL_LOW="Untergrenze Normalbereich";
i18n.NORMAL_RANGE="Normalbereich";
i18n.NOTE="PowerNote";
i18n.NOTE_INDICATOR="* Gibt einen Tag ohne 24-Stunden-Messzeitraum an.";
i18n.NOTE_NAME="PowerNote - Name";
i18n.NOTE_TYPE="PowerNote - Typ";
i18n.NOT_DONE="Nicht erledigt";
i18n.NOVEMBER=["Nov","November"];
i18n.NO_BILLING_FAVORITES="Keine Favoriten für Abrechnung gefunden";
i18n.NO_DATA="Keine Daten";
i18n.NO_GROWTH="Kein Wachstum";
i18n.NO_IMAGING_FAVORITES="Keine Favoriten für bildgebende Verfahren gefunden";
i18n.NO_KEY_PERSONS="Keine Schlüsselpersonen gefunden";
i18n.NO_KNOWN_HOME_MEDS="Für diesen Patienten sind keine bekannten Heimmedikationen vorhanden.";
i18n.NO_LABS_FAVORITES="Keine Favoriten für Labortests gefunden";
i18n.NO_LONGER_TAKING="Nicht mehr einnehmen";
i18n.NO_MEDS_FAVORITES="Keine Favoriten für Medikationen gefunden";
i18n.NO_ORDERS_FOR_SIGNATURE="Keine Anforderungen zum Abzeichnen vorhanden";
i18n.NO_OTHER_FAVORITES="Keine weiteren Favoriten gefunden";
i18n.NO_PREV_RES="-- Keine vorherigen Ergebnisse gefunden --";
i18n.NO_PREV_RES_LAST_24_HRS="-- Keine vorherigen Ergebnisse innerhalb der letzten 24 Stunden gefunden --";
i18n.NO_RES="-- Keine Ergebnisse gefunden --";
i18n.NO_RESULTS="Keine Ergebnisse";
i18n.NO_RESULTS_FOUND="Keine Ergebnisse gefunden";
i18n.NO_RES_LAST_24_HRS="-- Keine Ergebnisse innerhalb der letzten 24 Stunden gefunden --";
i18n.NO_RES_LAST_LOOKBACK_HRS="--Keine Ergebnisse in Suchbereich gefunden--";
i18n.NO_SUPPORT_CHARACTERS="Die Zeichen ^ und $ werden momentan nicht unterstützt.";
i18n.NO_ZOOM_APPLIED="Kein Zoom verwendet";
i18n.NUMBER="Anzahl";
i18n.NUMBEROFDAYS="Anzahl an Tagen";
i18n.NURSING_COMMUNICATION="Pflegekommunikation";
i18n.O2_FLOW_RATE="Sauerstofffluss";
i18n.O2_THERAPY_TITRATION="O2-Therapie/Titration";
i18n.O2_THERAPY_TITRATION_DETAILS="O2-Therapie/Titration - Details";
i18n.OCTOBER=["Okt","Oktober"];
i18n.OF="von";
i18n.ONSET_DATE="Beginndatum";
i18n.ORDERED="Angefordert";
i18n.ORDERING_PHYSICIAN="Anfordernder Arzt";
i18n.ORDERS="Anforderungen";
i18n.ORDERS_FOR_SIGNATURE="Anforderungen zum Abzeichnen";
i18n.ORDER_DATE="Anforderungsdatum/-zeit";
i18n.ORDER_DATE_TIME="Anforderungsdatum/-zeit";
i18n.ORDER_DETAILS="Anforderung - Details";
i18n.ORDER_DISPLAY_LINE="Anforderungsanzeigezeile";
i18n.ORDER_FAVORITE="Favoriten für Anforderungen";
i18n.ORDER_NAME="Anforderung";
i18n.ORDER_NAME="Anforderung";
i18n.ORDER_PARAMETERS="Anforderungsparameter";
i18n.ORDER_PHYS="Angefordert von";
i18n.ORDER_STATUS="Status";
i18n.ORDER_TYPE="Anforderungstyp";
i18n.ORIG_DT_TM="Ursprüngliches Anforderungsdatum/-zeit";
i18n.OTHER="Weitere";
i18n.OTHER_DIAGNOSTICS="Weitere Diagnostik";
i18n.OTHER_RESULTS="Weitere Ergebnisse";
i18n.OVERDUE_TASKS="Überfällige Aufgaben";
i18n.PAIN="Schmerzen";
i18n.PAIN_SCORE="Schmerzskala";
i18n.PARA_GRAVIDA="Para Gravida";
i18n.PARENT_PART_TYPE="Beziehung des gesetzlichen Vormunds";
i18n.PAST_PROBLEM="Beschwerde";
i18n.PAST_RESOLVED_DATE="Auflösungsdatum";
i18n.PATIENT_ASSESSMENT="Patientenbewertung";
i18n.PATIENT_FAMILY_EDUCATION="Aufklärung der Familie des Patienten";
i18n.PATIENT_FAMILY_EDUCATION_DETAILS="Aufklärung der Familie des Patienten - Details";
i18n.PEEP="PEEP";
i18n.PERCENTILE="Perzentile";
i18n.PERSON_NAME_HEADER="Patient";
i18n.PE_DATE="Datum:";
i18n.PE_INSTRUCTION="Anweisung:";
i18n.PE_PROVIDER="Klin. Mitarbeiter:";
i18n.PHOTOTHERAPY="Phototherapie";
i18n.PHOTOTHERAPY_RESULT="Ergebnis";
i18n.PLANNED_DISCHARGE_DISP="Zielzustand bei Entlassung";
i18n.PLANNED_DISCHARGE_DT_TM="Geplantes Entlassungsdatum";
i18n.PLAN_NAME="Name des Plans";
i18n.POC_SUMMARY="Übersicht über geplante Pflege";
i18n.POS="Positiv";
i18n.PREGNANCY="Schwangerschaft";
i18n.PREGNANCY_DETAILS="Schwangerschaft - Details";
i18n.PRESCRIBED="Verschrieben";
i18n.PREVIOUS="Vorherige";
i18n.PREVIOUS_ABG_RESULTS="Vorherige ABG-Ergebnisse";
i18n.PREVIOUS_BLOOD_GAS_ARTERIAL="Vorherige arterielle Blutgasanalyse";
i18n.PREVIOUS_BLOOD_GAS_ARTERIAL_RESULTS="Ergebnisse aus vorheriger arterieller Blutgasanalyse";
i18n.PRIMARY="Primär";
i18n.PRIMARY_RESULTS="Primäre Ergebnisse";
i18n.PRIM_PHYS="Hausarzt";
i18n.PRIM_PHYS="Hausarzt";
i18n.PRIORITY="Priorität";
i18n.PRN="Bedarfsmedikation";
i18n.PRN_48="Bedarfsmedikation, in letzten 48 Stunden verabreicht";
i18n.PRN_ALL="Bedarfsmedikation, alle";
i18n.PRN_UNSCHEDULED="Bedarfsmedikation/Nicht geplant verfügbar";
i18n.PROBLEM="Beschwerde";
i18n.PROBLEMS="Beschwerden";
i18n.PROBLEMS_DETAILS="Beschwerden - Details";
i18n.PROBLEMS_NAME="Beschwerden - Name";
i18n.PROCEDURE="Prozedur";
i18n.PROCEDURE_DATE="Prozedur - Datum";
i18n.PROCEDURE_DETAILS="Prozedur - Details";
i18n.PROCEDURE_NAME="Prozedur - Name";
i18n.PRODUCT="Produkt";
i18n.PROFSKILLEDSERVICESANTICIPATED="Voraussichtlich benötige Fachdienste";
i18n.PROVIDER="Klin. Mitarbeiter";
i18n.PSYCHOSOCIAL_FACTORS="Psychosoziale Faktoren";
i18n.PULMONARY_SUMMARY="Überblick über das Bronchial- und Lungensystem";
i18n.QM_COMPLETE="Abschließen";
i18n.QM_CONDITION="Krankheitsbild:";
i18n.QM_INCOMPLETE="Unvollständig";
i18n.RCM_ACTUAL_DISCHARGE_DISPOSITION="Tatsächlicher Entlassungszustand";
i18n.RCM_ADDENDUM="Nachtrag";
i18n.RCM_ADDENDUM_BY="Nachtrag von:";
i18n.RCM_ADDITIONAL_NOTES="Zusätzliche Notizen";
i18n.RCM_ADDITIONAL_REVIEWER_NOTES="Zusätzliche Notizen von Überprüfer";
i18n.RCM_ADD_ADDENDUM="Nachtrag hinzufügen";
i18n.RCM_ADMITTING_DX="Aufnahmediagnose";
i18n.RCM_ADMITTING_DX_DESC="Beschreibung für Aufnahmediagnose";
i18n.RCM_ADMIT_DATE="Aufnahmedatum";
i18n.RCM_ADMIT_SOURCE="Aufnahmeherkunft";
i18n.RCM_ADMIT_TO_BED_DT="Datum der Aufnahme mit Bettenzuweisung";
i18n.RCM_ADM_MIM="Dokument zu Patientenrechten bei Aufnahme";
i18n.RCM_ADVANCE_DIR_COMPL="Vorausverfügung ausgefüllt";
i18n.RCM_ADVANCE_DIR_ON_FILE="Vorausverfügung in Akte";
i18n.RCM_AGE="Alter";
i18n.RCM_ALTERNATE_DRG="Alternativer DRG";
i18n.RCM_ATTENDING_PHYSICIAN="Behandelnder Arzt";
i18n.RCM_AVOIDABLE_DAYS="Zu vermeidende Tage";
i18n.RCM_BED="Bett";
i18n.RCM_CANCEL="Abbrechen";
i18n.RCM_CANCEL_MESSAGE="Möchten Sie wirklich abbrechen?  Alle Änderungen gehen verloren.";
i18n.RCM_CARE_GUIDELINE="Pflegerichtlinie";
i18n.RCM_CARE_MANAGEMENT="Pflegeverwaltung";
i18n.RCM_CLINICAL_REVIEW="Klinische Überprüfung";
i18n.RCM_CLINICAL_REVIEW_ENTRY="Klinische Überprüfung - Eingabe";
i18n.RCM_CLINICAL_REVIEW_SUMMARY="Klinische Überprüfung - Zusammenfassung";
i18n.RCM_COLON=":";
i18n.RCM_COMPLETE="Abschließen";
i18n.RCM_CONTINUED_STAY="Weiterer Aufenthalt";
i18n.RCM_CRITERIA_MET="Erfüllte Kriterien";
i18n.RCM_CURRENT_ENCOUNTER="Aktueller Fall";
i18n.RCM_DATE="Datum";
i18n.RCM_DATEPICKER_TEXT="Datum auswählen";
i18n.RCM_DAY_REVIEWED="Überprüft am";
i18n.RCM_DELETE="Klinische Überprüfung löschen";
i18n.RCM_DELETE_FAILED="Löschen fehlgeschlagen";
i18n.RCM_DELETE_FAILED_MESSAGE="Die ausgewählte klinische Überprüfung wurde seit dem letzten Öffnen von einem anderen Benutzer geändert.  Die klinische Überprüfung kann nicht gelöscht werden.";
i18n.RCM_DELETE_MESSAGE="Möchten Sie die ausgewählte klinische Überprüfung wirklich löschen?";
i18n.RCM_DELETE_REVIEW="Überprüfung löschen";
i18n.RCM_DENIED_DAYS="Abgelehnte Tage";
i18n.RCM_DISCHARGE_ASSESSMENT_INFO="Informationen zur Entlassungsbewertung";
i18n.RCM_DISCHARGE_BARRIERS="Gründe gegen Entlassung";
i18n.RCM_DISCHARGE_DATE="Entlassungsdatum";
i18n.RCM_DISCHARGE_DISPOSITION="Entlassungszustand";
i18n.RCM_DISCHARGE_FACILITY="Entlassung aus Einrichtung";
i18n.RCM_DISCHARGE_NEXT_ASSESSMENT_DT="Datum der nächsten Untersuchung nach Entlassung";
i18n.RCM_DISCHARGE_OF_SERVICES="Entlassung aus Dienstleistungsbereichen";
i18n.RCM_DISCHARGE_PENDING="Entlassung ausstehend";
i18n.RCM_DISCHARGE_SCREEN="Screening bei Entlassung";
i18n.RCM_DISCHARGE_SCREENING="Screening bei Entlassung";
i18n.RCM_DISCHARGE_SLOT="Slot für Entlassung";
i18n.RCM_DISPLAY="Anzeigen";
i18n.RCM_DNR="Patientenverfügung";
i18n.RCM_DOB="Geburtsdatum";
i18n.RCM_DONE="Erledigt";
i18n.RCM_DRG_DESC="DRG-Beschreibung";
i18n.RCM_ELOS="Geschätzte Aufenthaltsdauer";
i18n.RCM_ENCOUNTER_TYPE="Falltyp";
i18n.RCM_ESTIMATED_DISCHARGE_DATE="Geschätztes Entlassungsdatum";
i18n.RCM_FACILITY="Einrichtung";
i18n.RCM_FAX_REVIEWS="Überprüfungen faxen";
i18n.RCM_FC="F/C";
i18n.RCM_FIN="Fallnummer";
i18n.RCM_FINAL="Finalisieren";
i18n.RCM_FINAL_AND_NEXT="Finalisieren & Weiter";
i18n.RCM_FINAL_DRG="Endgültiger DRG";
i18n.RCM_FINAL_DX="Endgültige Diagnose";
i18n.RCM_FINAL_PRIMARY_DX="Endgültige Hauptdiagnose";
i18n.RCM_FINANCIAL_CLASS="Buchungsklasse";
i18n.RCM_INCLUDE_CLOSED_UM_REVIEWS="Mit abgeschlossenen Utilization Management-Prüfungen";
i18n.RCM_INTENSITY_OF_SERVICES="Intensität der Leistungen";
i18n.RCM_LAST_ASSESSMENT_DATE="Datum der letzten Untersuchung";
i18n.RCM_LAST_REVIEW_DATE="Datum der letzten Überprüfung";
i18n.RCM_LEVEL_OF_SERVICE_SUBTYPE="Subtyp für Dienstgrad";
i18n.RCM_LOS="Aufenthaltsdauer";
i18n.RCM_LOS_ELOS="Aufenthaltsdauer/geschätzte Aufenthaltsdauer:";
i18n.RCM_MARK_AS_FINAL="Als 'Endgültig' markieren";
i18n.RCM_MED_SERVICE="Fachabteilung";
i18n.RCM_MET="Erreicht";
i18n.RCM_MODIFY="Ändern";
i18n.RCM_MRN="Patientennummer";
i18n.RCM_MY_RELATIONSHIP="Meine Beziehungen";
i18n.RCM_NAME="Name";
i18n.RCM_NEXT_CLINICAL_REVIEW="Nächste klinische Überprüfung fällig am:";
i18n.RCM_NEXT_CLINICAL_REVIEW_DATE="Datum der nächsten klinischen Überprüfung";
i18n.RCM_NEXT_CL_REVIEW="Nächste CL-Überprüfung";
i18n.RCM_NEXT_REVIEW_NEEDED="Nächste Überprüfung erforderlich";
i18n.RCM_NEXT_SECTION="Nächster Abschnitt";
i18n.RCM_NO="Nein";
i18n.RCM_NOMENCLATUREID="Nomenklaturkennung:";
i18n.RCM_NOT_MET="Nicht erreicht";
i18n.RCM_OBS_END_DTTM="Datum/Zeit des Beobachtungsendes";
i18n.RCM_OBS_START_DTTM="Datum/Zeit des Beobachtungsbeginns";
i18n.RCM_OK="OK";
i18n.RCM_OPEN_CLINICAL_REVIEW="Ausstehende klinische Überprüfung";
i18n.RCM_OUTCOME="Ergebnis";
i18n.RCM_PATIENT_LIST="Patientenliste";
i18n.RCM_PAYER="Kostenträger";
i18n.RCM_PENDING="Ausstehend";
i18n.RCM_PLANNED_DISCHARGE_DATE="Geplantes Entlassungsdatum";
i18n.RCM_PLANNED_DISCHARGE_DISPOSITION="Zielzustand bei Entlassung";
i18n.RCM_PREVIOUS_ADMISSION_INFO="Informationen zu vorherigen Aufnahmen";
i18n.RCM_PRIMARY_DX="Hauptdiagnose";
i18n.RCM_PRIMARY_UR_NURSE="Primärer Pfleger für Utilization Review";
i18n.RCM_REASON_FOR_REFERRAL="Grund für Überweisung";
i18n.RCM_REVIEW="Überprüfen";
i18n.RCM_REVIEWER="Überprüfer";
i18n.RCM_REVIEW_CRITERIA="Überprüfungskriterien";
i18n.RCM_REVIEW_DATE="Überprüfungsdatum";
i18n.RCM_REVIEW_DUE="Überprüfung fällig";
i18n.RCM_REVIEW_OUTCOME="Ergebnis der Überprüfung";
i18n.RCM_REVIWED_BY="Überprüft von:";
i18n.RCM_REVIW_TYPE="Überprüfungstyp";
i18n.RCM_ROOM="Zimmer";
i18n.RCM_SAVE="Speichern";
i18n.RCM_SAVE_AND_NEW="Speichern & Neu";
i18n.RCM_SAVE_FAILED="Speichern fehlgeschlagen";
i18n.RCM_SAVE_FAILED_MESSAGE="Die ausgewählte klinische Überprüfung wurde seit dem letzten Öffnen von einem anderen Benutzer geändert.  Ihre Änderungen an der klinischen Überprüfung können nicht übernommen werden.";
i18n.RCM_SECONDARY_REVIEW="Zweitüberprüfung";
i18n.RCM_SECONDARY_REVIEW_NEEDED="Zweitüberprüfung erforderlich";
i18n.RCM_SEVERITY_OF_ILLNESS="Schweregrad der Krankheit";
i18n.RCM_SOURCE_IDENTIFIER="Quellkennung:";
i18n.RCM_SR_DATE="Datum der Zweitüberprüfung";
i18n.RCM_SR_STATUS="Status der Zweitüberprüfung";
i18n.RCM_SSN="Versicherungsnummer";
i18n.RCM_STATUS="Status";
i18n.RCM_TYPE="Typ";
i18n.RCM_UM_INFO="Informationen zu Utilization Management";
i18n.RCM_UM_STATUS="Status des Utilization Management";
i18n.RCM_UNIT="Einheit";
i18n.RCM_UNIT_DISCHARGE_FROM="Einheit für 'Entlassen aus'";
i18n.RCM_UTILIZATION_MANAGEMENT="Verwendungsverwaltung";
i18n.RCM_VISIT_INFO="Informationen zum Aufenthalt";
i18n.RCM_WORKING_DRG="Arbeits-DRG";
i18n.RCM_WORKING_DRG_DESC="Beschreibung für Arbeits-DRG";
i18n.RCM_YES="Ja";
i18n.REACTION="Reaktion";
i18n.REASON="Grund";
i18n.REASON_FOR_VISIT="Grund für Aufenthalt";
i18n.RECOMMENDATION="Empfehlung";
i18n.REG_DT_TM="Anmeldedatum/-zeit";
i18n.RELATIONSHIP_HEADER="Beziehung";
i18n.REMAINING="Verbleibende";
i18n.REMINDERS="Erinnerungen";
i18n.RENDERING_DATA="Rendern";
i18n.REQUEST="Anfrage";
i18n.REQUESTED_START="Angefordertes Beginndatum";
i18n.RESET="Zoom zurücksetzen";
i18n.RESPIRATORY="Respiratorisch";
i18n.RESPIRATORY_DESCRIPTION="Beschreibung der Atmung";
i18n.RESPIRATORY_DESCRIPTION_DETAILS="Beschreibung der Atmung - Details";
i18n.RESPIRATORY_DISCLAIMER="Die angezeigten Ergebnisse für arterielle Blutgase müssen mit der Sauerstoffquelle für FIO2 und/oder der Sauerstoffflussrate zum Patienten zur Zeit der Probenabnahme synchronisiert werden.";
i18n.RESPONSIBLE_PROVIDER="Anforderung eingegeben von";
i18n.RESPONSIBLE_PROVIDER_NAME="Zuständiger klinischer Mitarbeiter";
i18n.RESP_MONITORING="Überwachung der Atmung";
i18n.RESP_RATE_TOTAL="Beatmungsrate, Gesamt";
i18n.RESTRAINT="Fixiergurte";
i18n.RESTRAINTS="Fixiergurte";
i18n.RESTRAINT_APPLIED="Fixiergurt angelegt";
i18n.RESTRAINT_DEATILS="Fixiergurt - Details";
i18n.RESTRAINT_LOCATION="Körperstelle für Fixiergut";
i18n.RESTRAINT_REASON="Grund für Fixierung";
i18n.RESTRAINT_TYPE="Fixierungstyp";
i18n.RESULT="Ergebnis";
i18n.RESULTS_RETURNED="Zurückgelieferte Ergebnisse";
i18n.RESULTS_SINCE_ADMITTED="Ergebnisse seit Aufnahme";
i18n.RESULT_DETAILS="Ergebnis - Details";
i18n.RESULT_DT_TM="Datum/Zeit des Ergebnisses";
i18n.RESUSITATION_STATUS="Reanimationseinwilligung";
i18n.RFV="Grund für Aufenthalt";
i18n.RFV="Grund für Aufenthalt";
i18n.ROOM_BED="Zimmer/Bett";
i18n.SAVE_PREFERENCES="Voreinstellungen speichern";
i18n.SAVE_PREF_SUCCESS="Die Voreinstellungen wurden erfolgreich gespeichert.";
i18n.SBP="Systolischer Blutdruck";
i18n.SCHEDULED="Geplant";
i18n.SCHEDULED_INH="Geplante Inhalationen";
i18n.SEARCH_MODE="Suchmodus";
i18n.SECONDARY="Sekundär";
i18n.SECONDARY_PROCEDURE="Sekundäre Prozedur";
i18n.SECONDARY_RESULTS="Sekundäre Ergebnisse";
i18n.SEIZURE_PRECAUTIONS="Präventionsmaßnahmen für Anfall";
i18n.SELECT="Auswählen";
i18n.SELECTED_N_VISIT="{0} für den ausgewählten Aufenthalt";
i18n.SELECTED_VISIT="Ausgewählter Aufenthalt";
i18n.SEPTEMBER=["Sep","September"];
i18n.SERVICE="Fachabteilung";
i18n.SETTINGS="Einstellungen";
i18n.SETTINGS_DETAILS="Einstellungen - Details";
i18n.SET_RATE="Flussgeschwindigkeit einrichten";
i18n.SET_TIDAL_VOLUME="Hubvolumen einrichten";
i18n.SEVERITY="Schweregrad";
i18n.SEX="Geschlecht";
i18n.SHOW_LEGEND="Legende anzeigen";
i18n.SHOW_SECTION="Erweitern";
i18n.SHOW_UP="Erschienen";
i18n.SIGN="Abzeichnen";
i18n.SIGNATURE_LINE="Unterschriftszeile";
i18n.SIGN_FAILED="Abzeichnen fehlgeschlagen";
i18n.SIG_LINE="Unterschriftszeile";
i18n.SINCE="Seit";
i18n.SITUATION_BACKGROUND="Familienverhältnisse";
i18n.SOCIAL_HISTORY_DETAILS="Sozialanamnese - Details";
i18n.SOCIAL_HISTORY_INFORMATION="Sozialanamnese";
i18n.SOURCE="Herkunft";
i18n.SOURCE_BODY_SITE="Herkunft/Körperstelle";
i18n.SOURCE_SITE="Herkunft/Körperstelle";
i18n.START="Beginnen";
i18n.START_DT_TM="Beginndatum/-zeit";
i18n.STATUS="Status";
i18n.STATUS_DATE="Statusdatum/-zeit";
i18n.STICKY_NOTES="Wichtige Notizen";
i18n.STOP="Beenden";
i18n.STOP_DT_TM="Enddatum/-zeit";
i18n.STOP_REASON="Beendigungsgrund";
i18n.STUDY="Studie";
i18n.SUBJECT="Betreff";
i18n.SUBMIT_FOR_SIGNATURE="Zum Abzeichnen einreichen";
i18n.SURGEON="Operateur";
i18n.SURGERY_START="Beginn der OP";
i18n.SURGERY_STOP="Ende der OP";
i18n.SURGICAL_FREE_TEXT="Freitext Chirurgie";
i18n.SUSCEPTIBILITY="Resistenztest";
i18n.SUSC_HEADER="SC";
i18n.SUSPENDED="Unterbrochen";
i18n.TABLE_GRAPH_DISCLAIMER="Die letzten dokumentierten Werte werden in der Tabelle des angegebenen Zeitrahmens angezeigt.";
i18n.TARGETED_DISCHARGE_DATE="Geplantes Entlassungsdatum";
i18n.TARGET_DISCH_DT_TM="Geplantes Entlassungsdatum/-zeit";
i18n.TEMPERATURE="Vorläufig";
i18n.TERTIARY="Tertiär";
i18n.TEXT="Text";
i18n.TOTAL_FL_BAL="Gesamter Flüssigkeitshaushalt";
i18n.TOTAL_FL_INTAKE="Gesamte Flüssigkeitseinfuhr";
i18n.TOTAL_FL_OUTPUT="Gesamte Flüssigkeitsausfuhr";
i18n.TOTAL_MINUTE_VOLUME="Gesamtvolumen pro Minute";
i18n.TOTAL_RESPIRATORY_RATE="Atemfrequenz, gesamt";
i18n.TRANSFER_OF_CARE_PACKET="Übermittlung des Pflegepakets";
i18n.TRANSFUSIONS="Transfusionen";
i18n.TRANSFUSION_DATE="Transfusionsdatum";
i18n.TRANSFUSION_EVENT_CD="Transfusion-Eventcode";
i18n.TRANSFUSION_RESULT_VAL="Ergebniswert";
i18n.TRANSPLANT_DATE="Transplantationsdatum";
i18n.TRANSPORATION_ARRANGED="Arrangierter Transport";
i18n.TUBES_DRAINS="Drainagen";
i18n.TWO_DAY_MAX="Höchstwert innerhalb 48 Stunden";
i18n.TYPE="Typ";
i18n.UNABLE_TO_OBTAIN_MED_HIST="Angaben zur Medikationshistorie können für den ausgewählten Aufenthalt nicht abgerufen werden.";
i18n.UNIT_OF_MEASURE="Maßeinheit";
i18n.UNKNOWN="Unbekannt";
i18n.UNSCHEDULED="Nicht geplant";
i18n.USER_CUSTOMIZATION="Benutzerspezifische Anpassung";
i18n.USER_CUST_DISCLAIMER="Bitte berücksichtigen Sie die Bildschirmauflösung, bevor Sie eine Ansicht mit drei Spalten auswählen.";
i18n.VENTILATOR_INFO="Beatmung";
i18n.VENTILATOR_MODE="Beatmungsmodus";
i18n.VENT_ALARMS_ON="Beatmungswarnungen an und funktionell";
i18n.VENT_ID="Beatmungsgerät - Kennung";
i18n.VENT_MODE="Beatmungsmodus";
i18n.VENT_MODEL="Beatmungsgerät - Modell";
i18n.VISIT="Aufenthalt";
i18n.VISIT="Aufenthalt";
i18n.VISIT_DETAILS="Aufenthalt - Details";
i18n.VISIT_REASON="Grund für Aufenthalt";
i18n.VITALS_TABLE="Vitalzeichentabelle";
i18n.WEANING_PARAMETERS="Entwöhnungsparameter";
i18n.WEANING_PARAMETERS_DETAILS="Entwöhnungsparameter - Details";
i18n.WITHIN="innerhalb von";
i18n.WITHIN_DAYS="{0} Tage";
i18n.WITHIN_HOURS="{0} Stunden";
i18n.WITHIN_MINS="{0} Minuten";
i18n.WITHIN_MONTHS="{0} Monate";
i18n.WITHIN_WEEKS="{0} Wochen";
i18n.WITHIN_YEARS="{0} Jahre";
i18n.ZSCORE="Z-Wert";
if(typeof i18n.discernabu=="undefined"){i18n.discernabu={};
}i18n.discernabu.ADD="Hinzufügen";
i18n.discernabu.ALL_N_VISITS="{0} für alle Aufenthalte";
i18n.discernabu.All_VISITS="Alle Aufenthalte";
i18n.discernabu.CLEAR_PREFERENCES="Voreinstellungen löschen";
i18n.discernabu.COLLAPSE_ALL="Alle minimieren";
i18n.discernabu.CUSTOMIZE="Anpassen";
i18n.discernabu.DAYNAMES=["So","Mo","Di","Mi","Do","Fr","Sa","Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"];
i18n.discernabu.DESCRIPTION="Beschreibung";
i18n.discernabu.DIAGNOSIS="Diagnose";
i18n.discernabu.DISCERN_ERROR="Discern-Fehler";
i18n.discernabu.DISCLAIMER="Diese Ansicht umfasst nicht alle Daten dieses Aufenthalts.";
i18n.discernabu.DUPLICATE="Diese Aktion würde ein/e/en doppelte/s/n {name} erstellen. Sie können {name} nicht hinzufügen.";
i18n.discernabu.ERROR_OPERATION="Operation";
i18n.discernabu.ERROR_OPERATION_STATUS="Operationsstatus";
i18n.discernabu.ERROR_RETREIVING_DATA="Fehler beim Suchen der Ergebnisse";
i18n.discernabu.ERROR_TARGET_OBJECT="Zielobjekts";
i18n.discernabu.ERROR_TARGET_OBJECT_VALUE="Wert des Zielobjekts";
i18n.discernabu.EXPAND_ALL="Alle erweitern";
i18n.discernabu.GO_TO_TAB="Gehe zu Register {0}";
i18n.discernabu.HELP="Hilfe";
i18n.discernabu.HIDE_SECTION="Minimieren";
i18n.discernabu.JS_ERROR="JavaScript-Fehler";
i18n.discernabu.LAST_N_DAYS="Letzte {0} Tage";
i18n.discernabu.LAST_N_HOURS="Letzte {0} Stunden";
i18n.discernabu.LAST_N_MONTHS="Letzte {0} Monate";
i18n.discernabu.LAST_N_WEEKS="Letzte{0} Wochen";
i18n.discernabu.LAST_N_YEARS="Letzte {0} Jahre";
i18n.discernabu.LOADING_DATA="Ladevorgang";
i18n.discernabu.MESSAGE="Nachricht";
i18n.discernabu.MONTHNAMES=["Jan.","Feb.","Mär.","Apr.","Mai","Jun.","Jul.","Aug.","Sep.","Okt.","Nov.","Dez.","Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
i18n.discernabu.NAME="Name";
i18n.discernabu.NO_PRIVS="Sie sind nicht berechtigt, das/den/die ausgewählte/n {name} hinzuzufügen.";
i18n.discernabu.NO_RESULTS_FOUND="Keine Ergebnisse gefunden";
i18n.discernabu.NUMBER="Anzahl";
i18n.discernabu.PROBLEM="Beschwerde";
i18n.discernabu.RENDERING_DATA="Rendern";
i18n.discernabu.REQUEST="Anfrage";
i18n.discernabu.SAVE_PREFERENCES="Voreinstellungen speichern";
i18n.discernabu.SELECTED_N_VISIT="{0} für den ausgewählten Aufenthalt";
i18n.discernabu.SELECTED_VISIT="Ausgewählter Aufenthalt";
i18n.discernabu.SHOW_SECTION="Erweitern";
i18n.discernabu.STATUS="Status";
i18n.discernabu.USER_CUSTOMIZATION="Benutzerspezifische Anpassung";
i18n.discernabu.USER_CUST_DISCLAIMER="Bitte berücksichtigen Sie die Bildschirmauflösung, bevor Sie eine Ansicht mit drei Spalten auswählen.";
i18n.discernabu.WITHIN_DAYS="{0} Tage";
i18n.discernabu.WITHIN_HOURS="{0} Stunden";
i18n.discernabu.WITHIN_MINS="{0} Minuten";
i18n.discernabu.WITHIN_MONTHS="{0} Monate";
i18n.discernabu.WITHIN_WEEKS="{0} Wochen";
i18n.discernabu.WITHIN_YEARS="{0} Jahre";
i18n.discernabu.X_DAYS="{0} Tage";
i18n.discernabu.X_HOURS="{0} Stunden";
i18n.discernabu.X_MINUTES="{0} Minuten";
i18n.discernabu.X_MONTHS="{0} Monate";
i18n.discernabu.X_WEEKS="{0} Wochen";
i18n.discernabu.X_YEARS="{0} Jahre";
var rcm_documentation_specialist_worklist_i18n = function(){
	return{
		DSWL_ACTUAL_LOS: "Actual LOS",
		DSWL_ADD_NOTE: "Add note",
		DSWL_ADMIT_DATE: "Admit Date",
		DSWL_ADMITTED: "Admitted",
        DSWL_ALERT_AUTH: "LOS has passed the Auth Date",
		DSWL_ALERT_CONCURRENT_DENIAL: "Concurrent Denial documented",
		DSWL_ALERT_DIFFERING_WORKING_DRGS : "Multiple Working Groups exist",
		DSWL_ALERT_FOLLOW_UP_RESPONSE_PAST_DUE: "Follow-up Response is Past Due",
		DSWL_ALERT_LOS_ELOS: "Actual LOS > Expected LOS",
        DSWL_ALERT_PDD: "LOS has passed the PDD Date",
		DSWL_ALERT_READMIT: "Patient Readmitted",
		DSWL_ALL: "All",
        DSWL_ALL_FUTURE_REVIEWS: "All future document reviews",
		DSWL_APPLY: "Apply",
		DSWL_ASCENDING: "Ascending",
		DSWL_ASSIGNED_TO_ME: "Assigned to Me",
		DSWL_ASSIGNED_TO_OTHERS: "Assigned to Others",
		DSWL_ATTENDING: "Attending{0}",
		DSWL_ATTENDING_PHYSICIAN: "Attending Physician",
		RCM_AUTH_END_DATE: "Auth End Date",
		DSWL_CANCEL: "Cancel",
		DSWL_COLLAPSE: "Collapse all",
		DSWL_COMPLETED_DOCUMENTATION_REVIEWS: "Completed Documentation Reviews",
		DSWL_CLASS: "Class",
		DSWL_DAYS_AGO: " days ago",
		DSWL_DESCENDING: "Descending",
		DSWL_DISCHARGE_DATE: "Discharge Date",
		DSWL_DISCHARGED: "Discharged",
		DSWL_DOB: "DOB",
		DSWL_DOCUMENTATION_REVIEW_STATUS: "Documentation Review Status",
		DSWL_DOCUMENTATION_SPECIALIST: "Documentation Specialist",
		DSWL_DRG: "Group",
		DSWL_DRG_CODE: "Group Code",
		DSWL_DRG_FINAL_HOVER: "Final",
		DSWL_DRG_WEIGHT: "Wgt:",
		DSWL_DRG_WORKING_HOVER: "Working",
		DSWL_ENCOUNTER_TYPE: "Encounter Type",
		DSWL_ERROR_MESSAGE: "Error Retrieving Data",
		DSWL_ESTIMATED_LENGTH_OF_STAY: "Estimated Length of Stay",
		DSWL_EXPAND: "Expand all",
		DSWL_EXPECTED_LOS: "Expected LOS",
		DSWL_FILTER_SETTINGS: "Filter settings",
		DSWL_FILTERS: "Filters",
		DSWL_FIN: "FIN",
		DSWL_FINANCIAL_CLASS: "Financial Class",
		DSWL_FINANCIAL_NUMBER: "Financial Number",
		DSWL_GENDER: "Gender",
		DSWL_GMLOS: "GMLOS",
		DSWL_IMPORTANT: "Important",
		DSWL_INCLUDE_COMPLETED_DOCUMENTATION_REVIEWS: "Include completed documentation reviews",
		DSWL_INCLUDE_NO_NEXT_DOCUMENTATION_REVIEW_DATE: "Include no next documentation review date",
		DSWL_INCLUDE_PATIENTS_WITH: "Include patients with:",
		DSWL_LAST_REVIEW: "Last Review",
		DSWL_LENGTH_OF_STAY: "Length of Stay",
        DSWL_LIST_MAINTENANCE: "List Maintenance",
		DSWL_LOCATION: "Location",
		DSWL_LOCATION_SHORT: "Location",
		DSWL_MED_SERVICE: "Med Service",
		DSWL_MISSING_DATA: "--",
		DSWL_MRN: "MRN", 
		DSWL_MY_RELATIONSHIP: "Relationship",
		DSWL_NEXT_DOCUMENT_REVIEW: "Next Document Review",
		DSWL_NEXT_DOCUMENT_REVIEW_LOWER: "Next document review: ",
		DSWL_NEXT_DOCUMENTATION_REVIEW_DATE: "Next Documentation Review",
		DSWL_NEXT_REVIEW: "Next Review",
        DSWL_NO_ACTIVE_LISTS: "There are no active lists.",
		DSWL_NO_ACTIVE_LISTS_LINE_2: "To manage your patient lists, access ",
		DSWL_NO_DATE: "No Date",
		DSWL_NO_DOCUMENTATION_REVIEW_DATE: "No Documentation Review Date",
		DSWL_NO_NOTES: "No current notes",
		DSWL_NO_PATIENT_LISTS: "There are no patient lists defined in Powerchart.",
		DSWL_NO_RESULTS_FOUND: "No Results Found.",
		DSWL_NOT_AVAILABLE: "Not Available",
		DSWL_NOTE: "Note",
		DSWL_NURSE_UNIT: "Nurse Unit",
		DSWL_NURSE_UNIT_ROOM_BED: "Nurse Unit/Room/Bed",
		DSWL_OF: "of",
		DSWL_OK: "OK",
		DSWL_PATIENT: "Patient",
		DSWL_PATIENT_AGE: "Patient Age",
		DSWL_PATIENT_LIST: "Patient List:",
		DSWL_PATIENT_NAME: "Patient Name",
		DSWL_PATIENTS: "Patients",
		DSWL_PAYER: "Payer",
		DSWL_PAYER_PRIMARY: "Payer (Primary):",
		DSWL_PERSIST: "Persist across encounters",
		DSWL_PERSIST_MESSAGE: "This option saves the note at the person level. The note will display regardless of the encounter selected.",
		DSWL_PIPE: " | ",
		DSWL_PLAN: "Plan",
		DSWL_POWERCHART: "Powerchart.exe",
		DSWL_PRIMARY_SORT: "Primary",
		DSWL_READMISSION: "Readmission",
		DSWL_READMITTED: "Readmitted",
		DSWL_RELATIONSHIP_ERROR_MESSAGE_PART_ONE: " does not have authority to be assigned as the ",
		DSWL_RELATIONSHIP_ERROR_MESSAGE_PART_TWO: ".  Select someone else.",
		DSWL_RELATIONSHIP_ERROR_TITLE: "Relationship cannot be Established",
		DSWL_REMOVE: "Remove",
		DSWL_REMOVE_NOTE: "Are you sure you want to remove this note?  It will be removed from the system.",
		DSWL_RISK_OF_MORTALITY: "ROM:",
		DSWL_SAVE: "Save",
		DSWL_SAVE_CONFIGURATION: "Save configuration as default",
		DSWL_SAVE_FAILED: "Unable to Save",
		DSWL_SAVE_FAILED_MESSAGE: "The system was unable to save. Try again.",
		DSWL_SECONDARY: "Secondary",
		DSWL_SEVERITY_OF_ILLNESS: "SOI:",
		DSWL_SLASH: " / ",
		DSWL_SORTING: "Sorting",
		DSWL_STALE_DATA_MESSAGE: "The encounter selected has been updated since opening the current session.  It cannot be saved until the data has been refreshed.  Reload the Documentation Review Worklist to view the updates and continue modifications.",
		DSWL_STALE_DATA_TITLE: "Unable to Save",
		DSWL_TODAY: "Today",
		DSWL_TOMORROW: "Tomorrow",
		DSWL_TYPE: "Type",
		DSWL_UNASSIGNED: "Unassigned",
		DSWL_UNITS_DAYS: " days ",
		DSWL_UNITS_HRS: " hrs ",
		DSWL_UP_TO_TODAY: "Up to today",
		DSWL_UP_TO_TOMORROW: "Up to tomorrow",
		DSWL_UP_TO_TWO: "Up to 2 days from now",
		DSWL_UP_TO_THREE: "Up to 3 days from now",
		DSWL_UP_TO_FOUR: "Up to 4 days from now",
		DSWL_UP_TO_FIVE: "Up to 5 days from now",
		DSWL_UP_TO_SIX: "Up to 6 days from now",
		DSWL_UP_TO_SEVEN: "Up to 7 days from now",
		DSWL_VALUE_ALL: "ALL",
		DSWL_VALUE_ASSIGNED_TO_ME: "ASSIGNED_TO_ME",
		DSWL_VALUE_ASSIGNED_TO_OTHERS: "ASSIGNED_TO_OTHERS",
		DSWL_VALUE_UNASSIGNED: "UNASSIGNED",
		DSWL_VISIT_LENGTH: "Visit Length",
		DSWL_VISIT_REASON: "Visit Reason",
		DSWL_YESTERDAY: "Yesterday"
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
