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
dateFormat.masks={"default":"ddd, dd mmm yyyy HH:MM:ss",shortDate:"d/m/yy",shortDate2:"dd/mm/yyyy",shortDate3:"dd/mm/yy",shortDate4:"mm/yyyy",shortDate5:"yyyy",mediumDate:"d mmm, yyyy",longDate:"d mmmm, yyyy",fullDate:"dddd, d mmmm, yyyy",shortTime:"HH:MM",mediumTime:"HH:MM:ss",longTime:"HH:MM:ss Z",militaryTime:"HH:MM",isoDate:"yyyy-mm-dd",isoTime:"HH:MM:ss",isoDateTime:"yyyy-mm-dd'T'HH:MM:ss",isoUtcDateTime:"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",longDateTime:"dd/mm/yyyy HH:MM:ss Z",longDateTime2:"dd/mm/yy HH:MM",longDateTime3:"dd/mm/yyyy HH:MM",shortDateTime:"dd/mm HH:MM"};
dateFormat.i18n={dayNames:["Dim","Lun","Mar","Mer","Jeu","Ven","Sam","Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"],monthNames:["Jan","Fév","Mar","Avr","Mai","Jun","Jui","Aoû","Sep","Oct","Nov","Déc","Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"]};
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
}MPAGE_LC.fr_FR={decimal_point:",",thousands_sep:" ",grouping:"3",time24hr:"HH:MM:ss",time24hrnosec:"HH:MM",shortdate2yr:"d/m/yy",fulldate2yr:"dd/mm/yy",fulldate4yr:"dd/mm/yyyy",fullmonth4yrnodate:"mm/yyyy",full4yr:"yyyy",fulldatetime2yr:"dd/mm/yy HH:MM",fulldatetime4yr:"dd/mm/yyyy HH:MM",fulldatetimenoyr:"dd/mm h:MM TT"};
if(typeof i18n=="undefined"){var i18n={};}
i18n.RCM_CALENDAR_LOCALIZATION = "fr";
//set to true for 24 hour format and false when 12 hour format
i18n.SET24HOUR = true;
if(typeof i18n=="undefined"){var i18n={};
}i18n.ACCORDING_TO_ZOOM="&nbsp;(la plage dépend du zoom)";
i18n.ACTION="Action";
i18n.ACTIVE="Actif";
i18n.ACTIVITY_LIST="Liste d'activités";
i18n.ACTIVITY_ORDER="Prescription d'activité";
i18n.ADD="Ajouter";
i18n.ADMINISTERED="Administré";
i18n.ADMIN_DATE="Date d'administration";
i18n.ADMIN_LAST_N_HOURS="Administré au cours des dernières {0} heures";
i18n.ADMIN_NOTES="Notes d'administration";
i18n.ADMISSION="Admission";
i18n.ADMIT_DATE="Date d'admission";
i18n.ADMIT_DIAG="Diagnostic à l'admission";
i18n.ADMIT_DX="Diagnostic à l'admission";
i18n.ADMIT_INFO="Informations sur l'admission";
i18n.ADMIT_PHYS="Médecin responsable de l'admission";
i18n.ADMIT_SOURCE="Source d'admission";
i18n.ADMIT_TO_BED_DT="Date d'admission au lit";
i18n.ADVANCE_DIRECTIVE="Directives anticipées";
i18n.AEROSOL_THERAPY="Réaction du patient aux médicaments inhalés";
i18n.AEROSOL_THERAPY_DETAILS="Informations sur la réaction du patient aux médicaments inhalés";
i18n.AGE="Âge";
i18n.ALARM_SETTINGS="Paramètres de l'alarme";
i18n.ALARM_SETTINGS_DETAILS="Informations sur les paramètres de l'alarme";
i18n.ALLERGY="Allergie";
i18n.ALLERGY_NAME="Nom de l'allergie";
i18n.ALL_DATA="Toutes les données";
i18n.ALL_N_VISITS="{0} pour toutes les consultations";
i18n.ANESTHESIA_TYPE="Type(s) d’anesthésie";
i18n.ANESTH_START="Début de l'anesthésie";
i18n.ANESTH_STOP="Fin de l'anesthésie";
i18n.ANNOTATED_DISPLAY="Nom d'affichage annoté";
i18n.ANNOTATED_DISPLAY_NAME="Affichage annoté";
i18n.APRIL=["Avr","Avril"];
i18n.ARRIVAL="Arrivée";
i18n.ARTIFICIAL_AIRWAY="Canule pharyngée";
i18n.ARTIFICIAL_AIRWAY_DETAILS="Informations sur la canule pharyngée";
i18n.ASSESSMENT="Évaluation";
i18n.ASSISTIVE_DEVICES="Matériel d'aide";
i18n.ASSOCIATED_MICRO_REPORTS="Rapports de microbiologie associés";
i18n.ASSOCIATED_MICRO_STAIN_REPORTS="Rapports de coloration microbiologique associés";
i18n.ATTENDING_PHD="Médecin responsable";
i18n.ATTENDING_PHYSICIAN="Médecin responsable";
i18n.ATTEND_PHYS="Médecin responsable";
i18n.AUGUST=["Aoû","Août"];
i18n.AUTH="Auth.";
i18n.AUTHCOMMENTS="Commentaires d'auth.";
i18n.AUTHDATES="Dates d'auth.";
i18n.AUTHOR="Auteur";
i18n.AUTHORIZATION="Autorisation";
i18n.A_LINE="Voie artérielle";
i18n.All_VISITS="Toutes les consultations";
i18n.BABY="Bébé";
i18n.BABY="Bébé";
i18n.BE="B.E.";
i18n.BENEFITS="Avantages";
i18n.BILLING="Facturation";
i18n.BLOOD_PRESSURE="Pression artérielle";
i18n.BLOOD_TYPE_RH="Sang de type Rh";
i18n.BP_UNIT="(mmHg)";
i18n.BREATH_SOUNDS_ASSESSMENT="Évaluation des bruits respiratoires";
i18n.BREATH_SOUNDS_ASSESSMENT_DETAILS="Informations sur l'évaluation des bruits respiratoires";
i18n.BTN_HVR="Cliquer pour documenter la divergence";
i18n.CANCEL="Annuler";
i18n.CARDIO="Cardiovasculaire";
i18n.CAREMANAGERUMPAGE="Résumé de la révision de l'utilisation";
i18n.CARE_LEVEL="Niveau de soins";
i18n.CASE_NUM="Numéro de cas";
i18n.CATEGORY="Catégorie";
i18n.CHANGE="Modifier";
i18n.CHEST="Thorax";
i18n.CHEST_ABD_XR="Radio thoracique/abdominale";
i18n.CHEST_PHYSIOTHERAPY="Hygiène bronchique";
i18n.CHEST_PHYSIOTHERAPY_DETAILS="Informations sur l'hygiène bronchique";
i18n.CHIEF_COMPLAINT="Plainte principale";
i18n.CHILD_NAME="Nom de l'enfant";
i18n.CLEAR_PREFERENCES="Effacer les préférences";
i18n.CLEAR_PREF_SUCCESS="Préférences effacées avec succès";
i18n.CLICK_TO_GO_TO_DISCHARGE_PROCESS="Cliquez pour vous rendre au Processus de sortie";
i18n.CLINICAL_DISPLAY="Affichage clinique";
i18n.CLOSE_X="Fermer X";
i18n.CODE="Code";
i18n.CODE_STATUS="Statut de code";
i18n.CODE_STATUS="Statut de code";
i18n.COINSURANCEDAYSREMAINING="Jours restants avec coassurance";
i18n.COLLAPSE_ALL="Réduire tout";
i18n.COLLECTED="Prélevé";
i18n.COLLECTED_DATE_TIME="Date/Heure de prélèvement";
i18n.COLLECTED_WITHIN="Prélèvement dans";
i18n.COMMENTS="Commentaires";
i18n.COMPLETED="Terminé";
i18n.COMPLETE_ORDERS="Remplir la ou les prescriptions";
i18n.COMPLIANCE="Observance";
i18n.CONDITION="État";
i18n.CONTACTS="Contacts";
i18n.CONTACT_PHYSICIAN="Contacter le médecin avant de prendre";
i18n.CONTINOUS="Continu";
i18n.CONTINUE="Continuer";
i18n.CONTINUE_WITH_CHANGES="Continuer avec modifications";
i18n.COPAY="Ticket modérateur";
i18n.COUGH_SUCTION="Toux/Aspiration";
i18n.COUGH_SUCTION_DETAILS="Informations sur la toux/aspiration";
i18n.COVEREDDAYSREMAINING="Jours restants avec assurance";
i18n.CRITICAL_HIGH="Critique élevé";
i18n.CRITICAL_LOW="Critique faible";
i18n.CRITICAL_RANGE="Plage critique";
i18n.CRITICAL_RESULTS="Résultats critiques";
i18n.CRIT_IND="C";
i18n.CUFF="Brassard pneumatique";
i18n.CURRENT="Actuel";
i18n.CUR_DOC_PLAN_SCREEN="Protocole/Test de dépistage actuel documenté";
i18n.CUSTOMIZE="Personnaliser";
i18n.DATE="Date";
i18n.DATE_PERFORMED="Date d'exécution";
i18n.DATE_TIME="Date/Heure";
i18n.DATE_TIME_INITIATED="Date/Heure de lancement";
i18n.DAYS="Jours";
i18n.DBP="Pression artérielle diastolique";
i18n.DC_COMPLETE="Terminer";
i18n.DC_IN_PROGRESS="En cours";
i18n.DC_NOT_STARTED="Non commencé";
i18n.DC_PLANNING_TM_TRACKED="Heure de la planification de la sortie suivie";
i18n.DC_REVIEWSIGN="Réviser et signer";
i18n.DECEASED="Décédé(e)";
i18n.DECEMBER=["Déc","Décembre"];
i18n.DEDUCTIBLE="Déductible";
i18n.DEDUCTIBLE_MET="Atteint";
i18n.DEGC="DegC";
i18n.DEGF="DegF";
i18n.DELAYREASON="Motif du retard";
i18n.DELAYS_TRACKED="Délais suivis";
i18n.DELIVERY_HOSPITAL="Hôpital de l'accouchement";
i18n.DESCRIPTION="Description";
i18n.DETAILS="Détails";
i18n.DEVICE_DETAILS="Données du dispositif";
i18n.DIAGNOSES="Diagnostic";
i18n.DIAGNOSES_DATE="Date du diagnostic";
i18n.DIAGNOSES_NAME="Nom du diagnostic";
i18n.DIAGNOSTIC="Examen et test";
i18n.DIAGNOSTIC_DETAILS="Informations sur l'examen/le test";
i18n.DIET="Régime";
i18n.DISCERN_ERROR="Erreur Discern";
i18n.DISCHARE_APPEALDELIVERED="Appel d'une décision de sortie livrée";
i18n.DISCHARGECAREMANAGEMENT="Résumé de la gestion des soins à la sortie";
i18n.DISCHARGE_DATE="Date de sortie";
i18n.DISCHARGE_DISPOSITION="Modalité de sortie";
i18n.DISCHARGE_INFORMATION="Informations sur la sortie";
i18n.DISCHARGE_LOCATION="Emplacement de sortie";
i18n.DISCHARGE_MIM_SIGNED="Document sur les droits du patient donné à la sortie";
i18n.DISCHARGE_PLANNER="Planificateur de sortie";
i18n.DISCHARGE_PROCESS="Processus de sortie";
i18n.DISCHARGE_SUMMARY="Résumé de sortie";
i18n.DISCLAIMER="Cette page ne comprend pas toutes les informations sur le séjour.";
i18n.DISCONTINUED="Arrêté";
i18n.DISPLAY_AS="Afficher sous forme de";
i18n.DISPLAY_MET="Afficher les résultats atteints";
i18n.DME_ANTICIPATED="Équipement médical durable anticipé";
i18n.DME_COORD="Équipement médical durable coordonné";
i18n.DOB="Date de naissance";
i18n.DOCUMENTATION_DETAILS="Informations sur la documentation";
i18n.DOCUMENTED="Documenté";
i18n.DOCUMENTED_ACTION="Action de divergence documentée";
i18n.DOCUMENTED_BY="Documenté par";
i18n.DOCUMENTED_VARIANCE="Motif de divergence documenté";
i18n.DOCUMENTS="Documents";
i18n.DOCUMENT_FAVS="Favoris introuvables";
i18n.DONE="Effectué";
i18n.DUE="Dû";
i18n.ED_SUMMARY="Résumé du séjour aux urgences";
i18n.EKG="ECG";
i18n.EMER_CONTACT="Personne à prévenir en cas d'urgence";
i18n.EMER_CONTACT="Personne à prévenir en cas d'urgence";
i18n.EMER_NUMBER="N° de tel en cas d'urgence";
i18n.EMER_NUMBER="N° de tel en cas d'urgence";
i18n.ENCNTR_TYPE="Type de séjour";
i18n.ENCOUNTERS="Séjours";
i18n.ENTERED="Saisi";
i18n.ERROR_OCCURED="Une erreur s'est produite.";
i18n.ERROR_OPERATION="Nom de l'opération";
i18n.ERROR_OPERATION_STATUS="Statut de l'opération";
i18n.ERROR_RETREIVING_DATA="Erreur de récupération des résultats";
i18n.ERROR_TARGET_OBJECT="Nom de l'objet cible";
i18n.ERROR_TARGET_OBJECT_VALUE="Valeur de l'objet cible";
i18n.ESTIMATED_DISCHARGE_DATE="Date de sortie prévue";
i18n.EVENTS="Événements";
i18n.EXAM="Examen";
i18n.EXPAND_ALL="Développer tout";
i18n.EXPIRATION_DATE_TIME="Date/Heure de péremption";
i18n.EXP_DATE="Date de péremption";
i18n.FALL_RISK_SCORE="Échelle de risque de chute";
i18n.FATHER_NAME="Nom du père";
i18n.FEBRUARY=["Fév","Février"];
i18n.FIN="N° de séjour";
i18n.FINAL_DIAGNOSIS="Diagnostic final";
i18n.FINAL_DRG="DRG finaux";
i18n.FIN_CLASS="Classe de séjour";
i18n.FIN_NUM="N° de séjour";
i18n.FIO2="FiO2";
i18n.FIRST_24HRS_ED_VISIT="Les résultats représentent les 24 premières heures de la consultation aux urgences";
i18n.FLAGGED="Marqué";
i18n.FLOW_RATE="Débit";
i18n.FROM="De";
i18n.FUTURE="Futur";
i18n.FU_ADDRESS="Adresse :";
i18n.FU_NAME="Nom :";
i18n.GENERAL_ASSESSMENT="Évaluation générale";
i18n.GESTATIONAL_AGE="Âge gestationnel";
i18n.GI="GI";
i18n.GO_TO_TAB="Aller à l''onglet {0}";
i18n.GROWTH="Croissance";
i18n.GROWTH_IND="Indice de croissance";
i18n.GU="GU";
i18n.HEART_RATE="Hre";
i18n.HELP="Aide";
i18n.HIDE_LEGEND="Masquer la légende";
i18n.HIDE_SECTION="Réduire";
i18n.HI_FLOW_NEB="Nébulisation haut débit";
i18n.HI_IND="É";
i18n.HOME_MEDICATION="Traitement personnel";
i18n.HOURS="Heures";
i18n.ICU_SUMMARY="Résumé du séjour aux soins intensifs";
i18n.IMAGING="Imagerie";
i18n.IMMUNIZATIONS="Vaccination";
i18n.IMMUNIZATIONS_DETAILS="Détails sur la vaccination";
i18n.INCENTIVE_SPIROMETRY="Spirométrie de stimulation";
i18n.INCENTIVE_SPIROMETRY_DETAILS="Informations sur la spirométrie de stimulation";
i18n.INCOMPLETE_ORDERS="Prescription(s) incomplète(s)";
i18n.INHALALATION="Inhalation";
i18n.INHALED="Inhalation";
i18n.INIT_DOC_DT_TM="Date/Heure de la première documentation";
i18n.INPATIENT_SUMMARY="Résumé d'hospitalisation";
i18n.INSPIRATORY_TIME_DELIVERED="% du temps inspiratoire";
i18n.INSPIRATORY_TIME_SET="Durée inspiratoire";
i18n.INTEGUMENTARY="Tégumentaire";
i18n.IO="Entrées et sorties";
i18n.ISOLATION="Isolement";
i18n.ISOLATION="Isolement";
i18n.JANUARY=["Jan","Janvier"];
i18n.JS_ERROR="Erreur JavaScript";
i18n.JULY=["Jui","Juillet"];
i18n.JUNE=["Jun","Juin"];
i18n.KEY_PERSON_RELATIONSHIPS="Relations avec personnes clés";
i18n.LABRAD="Laboratoire/Radiologie";
i18n.LABS="Laboratoire";
i18n.LAST="Dernière";
i18n.LAST_3_DAYS="Les 3 derniers jours de la consultation sélectionnée";
i18n.LAST_DOC="Dernière documentation";
i18n.LAST_DOC_BY="Dernière documentation par";
i18n.LAST_DOC_DT_TM="Date/Heure de la dernière documentation";
i18n.LAST_DOC_DT_TM="Date/Heure de la dernière documentation";
i18n.LAST_DOC_WITHIN="Dernières documentations au cours des";
i18n.LAST_DOSE="Dernière dose";
i18n.LAST_DOSE_DT_TM="Dernière dose";
i18n.LAST_EVALUATION="Dernière évaluation";
i18n.LAST_GIVEN="Dernière administration";
i18n.LAST_N_DAYS="{0} derniers jours";
i18n.LAST_N_HOURS="{0} dernières heures";
i18n.LAST_N_MONTHS="{0} derniers mois";
i18n.LAST_N_WEEKS="{0} dernières semaines";
i18n.LAST_N_YEARS="{0} dernières années";
i18n.LAST_PARTICIPATION="Dernière participation";
i18n.LAST_UPDATED="Dernière mise à jour";
i18n.LAST_UPDATED_BY="Dernière mise à jour par";
i18n.LAST_VISIT="Dernière consultation";
i18n.LATEST="Dernier résultat";
i18n.LATEST_ABG_RESULTS="Résultats GDS les plus récents";
i18n.LATEST_BLOOD_GAS_ARTERIAL="Examen de gaz du sang le plus récent";
i18n.LATEST_BLOOD_GAS_ARTERIAL_RESULTS="Résultats de l'examen de gaz du sang le plus récent";
i18n.LENGTH_OF_LABOR="Durée du travail";
i18n.LENGTH_OF_STAY="Durée du séjour";
i18n.LIFETIMEMAX="Durée de vie max.";
i18n.LINES="Voies";
i18n.LOADING_DATA="Chargement";
i18n.LOCATION="Emplacement";
i18n.LOS="Durée de séjour";
i18n.LOT="Lot";
i18n.LOW_IND="F";
i18n.LTRDAILYDEDUCTABLE="Franchise quotidienne pour la rééducation à long terme";
i18n.LTRDAYSREMAINING="Jours restants LTR";
i18n.MANUFACTURER="Fabricant";
i18n.MAP="Pression artérielle moyenne";
i18n.MARCH=["Mar","Mars"];
i18n.MASTER_GRAPH="Graphique principal";
i18n.MAX="Max.";
i18n.MAY=["Mai","Mai"];
i18n.MEASUREMENTS_ASSESSMENTS="Mesures et évaluations";
i18n.MEASUREMENTS_ASSESSMENTS_DETAILS="Données des mesures et évaluations";
i18n.MEASUREMENT_DETAILS="Détails des mesures";
i18n.MEDICATIONS="Médicaments";
i18n.MEDS="Médicaments";
i18n.MEDS_ADMINISTERED="Médicament(s) administré(s)";
i18n.MED_DETAIL="Informations sur le médicament";
i18n.MED_NAME="Médicament";
i18n.MEMBERS="Membres";
i18n.MESSAGE="Message";
i18n.MET="atteint";
i18n.MICRO="Microbiologie";
i18n.MIM_SIGNED="Document sur les droits du patient signé à l'admission";
i18n.MIN="Min.";
i18n.MINS="Minutes";
i18n.MODEL="Modèle";
i18n.MODE_OF_ARRVAL="Mode d’arrivée";
i18n.MODIFIERS="Modificateurs";
i18n.MOTHER="Mère";
i18n.MRN="IPP";
i18n.MULTIPLE="Multiple";
i18n.MUSCULOSKELETAL="Appareil musculo-squelettique";
i18n.NAME="Nom";
i18n.NEBULIZED="Nébulisateur";
i18n.NEG="NÉG.";
i18n.NEURO="Neuro";
i18n.NEW="Nouveau";
i18n.NEXT_DOSE="Dose suivante";
i18n.NEXT_DOSE_DT_TM="Dose suivante";
i18n.NEXT_N_HOURS="{0} prochaines heures";
i18n.NORMALITY="Normalité";
i18n.NORMAL_HIGH="Normal élevé";
i18n.NORMAL_LOW="Normal faible";
i18n.NORMAL_RANGE="Plage normale";
i18n.NOTE="Remarque";
i18n.NOTE_INDICATOR="* Indique une journée sans une période de mesure de 24 heures complète";
i18n.NOTE_NAME="Intitulé de la note";
i18n.NOTE_TYPE="Type de note";
i18n.NOT_DONE="Non effectué";
i18n.NOVEMBER=["Nov","Novembre"];
i18n.NO_BILLING_FAVORITES="Aucun favori de facturation n'a été trouvé";
i18n.NO_DATA="Aucune donnée";
i18n.NO_GROWTH="Absence de croissance";
i18n.NO_IMAGING_FAVORITES="Aucun favori d'imagerie n'a été trouvé";
i18n.NO_KEY_PERSONS="Personne clé introuvable";
i18n.NO_KNOWN_HOME_MEDS="Aucun traitement personnel connu n'existe pour ce patient.";
i18n.NO_LABS_FAVORITES="Aucun favori de résultat de laboratoire n'a été trouvé";
i18n.NO_LONGER_TAKING="Ne prend plus";
i18n.NO_MEDS_FAVORITES="Aucun favori de médicament n'a été trouvé";
i18n.NO_ORDERS_FOR_SIGNATURE="Aucune prescription à signer";
i18n.NO_OTHER_FAVORITES="Aucun autre favori n'a été trouvé";
i18n.NO_PREV_RES="-- Aucun résultat précédent n'a été trouvé --";
i18n.NO_PREV_RES_LAST_24_HRS="-- Aucun résultat précédent n'a été trouvé au cours des dernières 24 heures --";
i18n.NO_RES="-- Aucun résultat n'a été trouvé --";
i18n.NO_RESULTS="Aucun résultat";
i18n.NO_RESULTS_FOUND="Aucun résultat n'a été trouvé.";
i18n.NO_RES_LAST_24_HRS="-- Aucun résultat n'a été trouvé au cours des dernières 24 heures --";
i18n.NO_RES_LAST_LOOKBACK_HRS="--Aucun résultat n'existe dans la période de recherche rétrospective--";
i18n.NO_SUPPORT_CHARACTERS="Les symboles ^ et $ ne sont actuellement pas pris en charge.";
i18n.NO_ZOOM_APPLIED="Aucun zoom n'est appliqué.";
i18n.NUMBER="Numéro";
i18n.NUMBEROFDAYS="Nombre de jours";
i18n.NURSING_COMMUNICATION="Communication des soins";
i18n.O2_FLOW_RATE="Débit 02";
i18n.O2_THERAPY_TITRATION="Thérapie/titrage O2";
i18n.O2_THERAPY_TITRATION_DETAILS="Informations sur la thérapie/le titrage O2";
i18n.OCTOBER=["Oct","Octobre"];
i18n.OF="sur";
i18n.ONSET_DATE="Date de début";
i18n.ORDERED="Prescrit";
i18n.ORDERING_PHYSICIAN="Médecin prescripteur";
i18n.ORDERS="Prescriptions";
i18n.ORDERS_FOR_SIGNATURE="Prescriptions à signer";
i18n.ORDER_DATE="Date/Heure de prescription";
i18n.ORDER_DATE_TIME="Date/Heure de prescription";
i18n.ORDER_DETAILS="Informations sur la prescription";
i18n.ORDER_DISPLAY_LINE="Ligne d'affichage de prescription";
i18n.ORDER_FAVORITE="Favoris - Prescriptions";
i18n.ORDER_NAME="Nom de la prescription";
i18n.ORDER_NAME="Prescription";
i18n.ORDER_PARAMETERS="Paramètres de prescription";
i18n.ORDER_PHYS="Prescrit par";
i18n.ORDER_STATUS="Statut";
i18n.ORDER_TYPE="Type de prescription";
i18n.ORIG_DT_TM="Date/Heure de la prescription d'origine";
i18n.OTHER="Autre";
i18n.OTHER_DIAGNOSTICS="Autres examens et tests";
i18n.OTHER_RESULTS="Autres résultats";
i18n.OVERDUE_TASKS="Tâches en retard";
i18n.PAIN="Douleur";
i18n.PAIN_SCORE="Niveau de douleur";
i18n.PARA_GRAVIDA="Accouchement/Grossesse";
i18n.PARENT_PART_TYPE="Relation du tuteur légal";
i18n.PAST_PROBLEM="Problème";
i18n.PAST_RESOLVED_DATE="Date de résolution";
i18n.PATIENT_ASSESSMENT="Évaluation du patient";
i18n.PATIENT_FAMILY_EDUCATION="Éducation du patient/de la famille";
i18n.PATIENT_FAMILY_EDUCATION_DETAILS="Informations sur l'éducation du patient/de la famille";
i18n.PEEP="PEEP";
i18n.PERCENTILE="Percentile";
i18n.PERSON_NAME_HEADER="Nom de la personne";
i18n.PE_DATE="Date :";
i18n.PE_INSTRUCTION="Instruction :";
i18n.PE_PROVIDER="Soignant :";
i18n.PHOTOTHERAPY="Photothérapie";
i18n.PHOTOTHERAPY_RESULT="Résultat";
i18n.PLANNED_DISCHARGE_DISP="Modalités de sortie planifiées";
i18n.PLANNED_DISCHARGE_DT_TM="Date de sortie planifiée";
i18n.PLAN_NAME="Nom du plan";
i18n.POC_SUMMARY="Résumé du plan de soins";
i18n.POS="POS.";
i18n.PREGNANCY="Grossesse";
i18n.PREGNANCY_DETAILS="Informations sur la grossesse";
i18n.PRESCRIBED="Prescrit";
i18n.PREVIOUS="Précédent";
i18n.PREVIOUS_ABG_RESULTS="Résultats GDS précédents";
i18n.PREVIOUS_BLOOD_GAS_ARTERIAL="Examen de gaz du sang précédent";
i18n.PREVIOUS_BLOOD_GAS_ARTERIAL_RESULTS="Résultats de l'examen de gaz du sang précédent";
i18n.PRIMARY="Principal";
i18n.PRIMARY_RESULTS="Résultats principaux";
i18n.PRIM_PHYS="Médecin traitant";
i18n.PRIORITY="Priorité";
i18n.PRN="PRN";
i18n.PRN_48="PRN - Administrés au cours des dernières 48 heures";
i18n.PRN_ALL="PRN - Tous";
i18n.PRN_UNSCHEDULED="PRN/Non planifié disponible";
i18n.PROBLEM="Problème";
i18n.PROBLEMS="Problèmes";
i18n.PROBLEMS_DETAILS="Informations sur les problèmes";
i18n.PROBLEMS_NAME="Nom des problèmes";
i18n.PROCEDURE="Procédure";
i18n.PROCEDURE_DATE="Date de la procédure";
i18n.PROCEDURE_DETAILS="Informations sur la procédure";
i18n.PROCEDURE_NAME="Nom de la procédure";
i18n.PRODUCT="Produit";
i18n.PROFSKILLEDSERVICESANTICIPATED="Services de professionnels compétents anticipés";
i18n.PROVIDER="Soignant";
i18n.PSYCHOSOCIAL_FACTORS="Facteurs psychosociaux";
i18n.PULMONARY_SUMMARY="Résumé pulmonaire";
i18n.QM_COMPLETE="Terminer";
i18n.QM_CONDITION="Condition :";
i18n.QM_INCOMPLETE="Incomplet";
i18n.RCM_ACTUAL_DISCHARGE_DISPOSITION="Modalité de sortie actuelle";
i18n.RCM_ADDENDUM="Addendum";
i18n.RCM_ADDENDUM_BY="Addendum par :";
i18n.RCM_ADDITIONAL_NOTES="Notes supplémentaires";
i18n.RCM_ADDITIONAL_REVIEWER_NOTES="Notes supplémentaires du réviseur";
i18n.RCM_ADD_ADDENDUM="Ajouter un addendum";
i18n.RCM_ADMITTING_DX="Diagnostic à l'admission";
i18n.RCM_ADMITTING_DX_DESC="Description du diagnostic à l'admission";
i18n.RCM_ADMIT_DATE="Date d'admission";
i18n.RCM_ADMIT_SOURCE="Source d'admission";
i18n.RCM_ADMIT_TO_BED_DT="Date/Heure de l'admission au lit";
i18n.RCM_ADM_MIM="Document sur les droits du patient à l'admission";
i18n.RCM_ADVANCE_DIR_COMPL="Directives anticipées complétées";
i18n.RCM_ADVANCE_DIR_ON_FILE="Directives anticipées archivées";
i18n.RCM_AGE="Âge";
i18n.RCM_ALTERNATE_DRG="DRG alternatif";
i18n.RCM_ATTENDING_PHYSICIAN="Médecin responsable";
i18n.RCM_AVOIDABLE_DAYS="Jours évitables";
i18n.RCM_BED="Lit";
i18n.RCM_CANCEL="Annuler";
i18n.RCM_CANCEL_MESSAGE="Êtes-vous sûr de vouloir annuler ? Toutes les modifications seront perdues.";
i18n.RCM_CARE_GUIDELINE="Consignes de soins";
i18n.RCM_CARE_MANAGEMENT="Gestion des soins";
i18n.RCM_CLINICAL_REVIEW="Révision clinique";
i18n.RCM_CLINICAL_REVIEW_ENTRY="Saisie de la révision clinique";
i18n.RCM_CLINICAL_REVIEW_SUMMARY="Résumé de la révision clinique";
i18n.RCM_COLON=":";
i18n.RCM_COMPLETE="Terminer";
i18n.RCM_CONTINUED_STAY="Séjour continu";
i18n.RCM_CRITERIA_MET="Critères remplis";
i18n.RCM_CURRENT_ENCOUNTER="Séjour actuel";
i18n.RCM_DATE="Date";
i18n.RCM_DATEPICKER_TEXT="Choisissez une date.";
i18n.RCM_DAY_REVIEWED="Jour révisé";
i18n.RCM_DELETE="Supprimer la révision clinique";
i18n.RCM_DELETE_FAILED="Échec de la suppression";
i18n.RCM_DELETE_FAILED_MESSAGE="La révision clinique sélectionnée a été modifiée par un autre utilisateur depuis son ouverture. La révision clinique ne peut pas être supprimée.";
i18n.RCM_DELETE_MESSAGE="Êtes-vous sûr de vouloir supprimer la révision clinique sélectionnée ?";
i18n.RCM_DELETE_REVIEW="Supprimer la révision";
i18n.RCM_DENIED_DAYS="Jours refusés";
i18n.RCM_DISCHARGE_ASSESSMENT_INFO="Informations sur l'évaluation à la sortie";
i18n.RCM_DISCHARGE_BARRIERS="Obstacles à la sortie";
i18n.RCM_DISCHARGE_DATE="Date de sortie";
i18n.RCM_DISCHARGE_DISPOSITION="Modalité de sortie";
i18n.RCM_DISCHARGE_FACILITY="Établissement de sortie";
i18n.RCM_DISCHARGE_NEXT_ASSESSMENT_DT="Date/Heure de l'évaluation de la prochaine sortie";
i18n.RCM_DISCHARGE_OF_SERVICES="Sortie des services";
i18n.RCM_DISCHARGE_PENDING="Sortie en attente";
i18n.RCM_DISCHARGE_SCREEN="Évaluer au moment de la sortie";
i18n.RCM_DISCHARGE_SCREENING="Évaluation au moment de la sortie";
i18n.RCM_DISCHARGE_SLOT="Créneau de sortie";
i18n.RCM_DISPLAY="Affichage";
i18n.RCM_DNR="Ne pas ressusciter";
i18n.RCM_DOB="Date de naissance";
i18n.RCM_DONE="Effectué";
i18n.RCM_DRG_DESC="Description DRG";
i18n.RCM_ELOS="ELOS";
i18n.RCM_ENCOUNTER_TYPE="Type de séjour";
i18n.RCM_ESTIMATED_DISCHARGE_DATE="Date de sortie prévue";
i18n.RCM_FACILITY="Établissement";
i18n.RCM_FAX_REVIEWS="Révisions des fax";
i18n.RCM_FC="F/C";
i18n.RCM_FIN="N° de séjour";
i18n.RCM_FINAL="Final";
i18n.RCM_FINAL_AND_NEXT="Final et suivant";
i18n.RCM_FINAL_DRG="DRG finaux";
i18n.RCM_FINAL_DX="Diagnostic final";
i18n.RCM_FINAL_PRIMARY_DX="Diagnostic principal final";
i18n.RCM_FINANCIAL_CLASS="Classe de séjour";
i18n.RCM_INCLUDE_CLOSED_UM_REVIEWS="Inclure les révisions de gestion de l'utilisation fermées";
i18n.RCM_INTENSITY_OF_SERVICES="Intensité des services";
i18n.RCM_LAST_ASSESSMENT_DATE="Date de la dernière évaluation";
i18n.RCM_LAST_REVIEW_DATE="Date de la dernière révision";
i18n.RCM_LEVEL_OF_SERVICE_SUBTYPE="Sous-type du niveau de service";
i18n.RCM_LOS="Durée de séjour";
i18n.RCM_LOS_ELOS="Durée du séjour / Durée du séjour estimée :";
i18n.RCM_MARK_AS_FINAL="Marquer comme Final";
i18n.RCM_MED_SERVICE="UF";
i18n.RCM_MET="Atteint";
i18n.RCM_MODIFY="Modifier";
i18n.RCM_MRN="IPP";
i18n.RCM_MY_RELATIONSHIP="Ma relation";
i18n.RCM_NAME="Nom";
i18n.RCM_NEXT_CLINICAL_REVIEW="Prochaine révision clinique à rendre le :";
i18n.RCM_NEXT_CLINICAL_REVIEW_DATE="Date de la prochaine révision clinique";
i18n.RCM_NEXT_CL_REVIEW="Prochaine révision clinique";
i18n.RCM_NEXT_REVIEW_NEEDED="Prochaine révision nécessaire";
i18n.RCM_NEXT_SECTION="Section suivante";
i18n.RCM_NO="Non";
i18n.RCM_NOMENCLATUREID="ID de nomenclature :";
i18n.RCM_NOT_MET="Non atteint";
i18n.RCM_OBS_END_DTTM="Date/Heure de fin de l'observation";
i18n.RCM_OBS_START_DTTM="Date/Heure de début de l'observation";
i18n.RCM_OK="OK";
i18n.RCM_OPEN_CLINICAL_REVIEW="Ouvrir Révision clinique";
i18n.RCM_OUTCOME="Résultat";
i18n.RCM_PATIENT_LIST="Liste de patients";
i18n.RCM_PAYER="Payeur";
i18n.RCM_PENDING="En attente";
i18n.RCM_PLANNED_DISCHARGE_DATE="Date de sortie planifiée";
i18n.RCM_PLANNED_DISCHARGE_DISPOSITION="Modalités de sortie planifiées";
i18n.RCM_PREVIOUS_ADMISSION_INFO="Informations sur l'admission précédente";
i18n.RCM_PRIMARY_DX="Diagnostic principal";
i18n.RCM_PRIMARY_UR_NURSE="Infirmière principale UR";
i18n.RCM_REASON_FOR_REFERRAL="Motif de l'orientation :";
i18n.RCM_REVIEW="Réviser";
i18n.RCM_REVIEWER="Réviseur";
i18n.RCM_REVIEW_CRITERIA="Critères de révision";
i18n.RCM_REVIEW_DATE="Date de révision";
i18n.RCM_REVIEW_DUE="Révision due";
i18n.RCM_REVIEW_OUTCOME="Résultat de la révision";
i18n.RCM_REVIWED_BY="Révisé par :";
i18n.RCM_REVIW_TYPE="Type de révision";
i18n.RCM_ROOM="Chambre";
i18n.RCM_SAVE="Enregistrer";
i18n.RCM_SAVE_AND_NEW="Enregistrer et Nouveau";
i18n.RCM_SAVE_FAILED="L'enregistrement a échoué.";
i18n.RCM_SAVE_FAILED_MESSAGE="La révision clinique sélectionnée a été modifiée par un autre utilisateur depuis son ouverture.  Les modifications apportées à la révision clinique ne peuvent être mises à jour.";
i18n.RCM_SECONDARY_REVIEW="Deuxième révision";
i18n.RCM_SECONDARY_REVIEW_NEEDED="Révision secondaire nécessaire";
i18n.RCM_SEVERITY_OF_ILLNESS="Gravité de la maladie";
i18n.RCM_SOURCE_IDENTIFIER="ID de la source :";
i18n.RCM_SR_DATE="Date de la révision secondaire";
i18n.RCM_SR_STATUS="Statut de la révision secondaire";
i18n.RCM_SSN="N° de sécurité sociale";
i18n.RCM_STATUS="Statut";
i18n.RCM_TYPE="Type";
i18n.RCM_UM_INFO="Informations sur la gestion de l'utilisation";
i18n.RCM_UM_STATUS="Statut de la gestion de l'utilisation";
i18n.RCM_UNIT="Unité";
i18n.RCM_UNIT_DISCHARGE_FROM="Sortie de l'unité de";
i18n.RCM_UTILIZATION_MANAGEMENT="Gestion de l'utilisation";
i18n.RCM_VISIT_INFO="Informations sur la consultation";
i18n.RCM_WORKING_DRG="DRG de travail";
i18n.RCM_WORKING_DRG_DESC="Description du DRG de travail";
i18n.RCM_YES="Oui";
i18n.REACTION="Réaction";
i18n.REASON="Motif";
i18n.REASON_FOR_VISIT="Motif de venue";
i18n.RECOMMENDATION="Recommandation";
i18n.REG_DT_TM="Date/Heure de l'enregistrement";
i18n.RELATIONSHIP_HEADER="Relation";
i18n.REMAINING="Restant";
i18n.REMINDERS="Rappels";
i18n.RENDERING_DATA="Rendu";
i18n.REQUEST="Requête";
i18n.REQUESTED_START="Début demandé";
i18n.RESET="Réinitialiser le zoom";
i18n.RESPIRATORY="Respiratoire";
i18n.RESPIRATORY_DESCRIPTION="Description de la respiration";
i18n.RESPIRATORY_DESCRIPTION_DETAILS="Informations sur la description de la respiration";
i18n.RESPIRATORY_DISCLAIMER="Les résultats de gaz du sang affichés doivent être synchronisés avec la source d'oxygène FiO2 et/ou le débit d'oxygène qui était administré au patient au moment où l'échantillon a été prélevé.";
i18n.RESPONSIBLE_PROVIDER="Prescription saisie par";
i18n.RESPONSIBLE_PROVIDER_NAME="Soignant responsable";
i18n.RESP_MONITORING="Surveillance respiratoire";
i18n.RESP_RATE_TOTAL="Fréquence respiratoire totale";
i18n.RESTRAINT="Contention";
i18n.RESTRAINTS="Contentions";
i18n.RESTRAINT_APPLIED="Contention appliquée";
i18n.RESTRAINT_DEATILS="Informations sur la contention";
i18n.RESTRAINT_LOCATION="Emplacement de la contention";
i18n.RESTRAINT_REASON="Motif de la contention";
i18n.RESTRAINT_TYPE="Type de contention";
i18n.RESULT="Résultat";
i18n.RESULTS_RETURNED="Résultat(s) retourné(s)";
i18n.RESULTS_SINCE_ADMITTED="Résultats depuis le moment de l'admission";
i18n.RESULT_DETAILS="Données de résultat";
i18n.RESULT_DT_TM="Date/Heure de résultat";
i18n.RESUSITATION_STATUS="État de réanimation";
i18n.RFV="Motif de venue";
i18n.RFV="Motif de venue";
i18n.ROOM_BED="Chambre/lit";
i18n.SAVE_PREFERENCES="Enregistrer les préférences";
i18n.SAVE_PREF_SUCCESS="Préférences enregistrées avec succès";
i18n.SBP="Pression artérielle systolique";
i18n.SCHEDULED="Planifié";
i18n.SCHEDULED_INH="Planifié/inhalé";
i18n.SEARCH_MODE="Mode de recherche";
i18n.SECONDARY="Secondaire";
i18n.SECONDARY_PROCEDURE="Procédure secondaire";
i18n.SECONDARY_RESULTS="Résultats secondaires";
i18n.SEIZURE_PRECAUTIONS="Précautions lors de crises";
i18n.SELECT="Sélectionner";
i18n.SELECTED_N_VISIT="{0} pour la consultation sélectionnée";
i18n.SELECTED_VISIT="Consultation sélectionnée";
i18n.SEPTEMBER=["Sep","Septembre"];
i18n.SERVICE="Service";
i18n.SETTINGS="Paramètres";
i18n.SETTINGS_DETAILS="Informations sur les paramètres";
i18n.SET_RATE="Définir le débit";
i18n.SET_TIDAL_VOLUME="Définir le volume courant";
i18n.SEVERITY="Gravité";
i18n.SEX="Sexe";
i18n.SHOW_LEGEND="Afficher la légende";
i18n.SHOW_SECTION="Développer";
i18n.SHOW_UP="Présent";
i18n.SIGN="Signer";
i18n.SIGNATURE_LINE="Ligne de signature";
i18n.SIGN_FAILED="Échec de la signature";
i18n.SIG_LINE="Ligne de signature";
i18n.SINCE="Depuis";
i18n.SITUATION_BACKGROUND="Situation/Antécédents";
i18n.SOCIAL_HISTORY_DETAILS="Détails sur les antécédents sociaux";
i18n.SOCIAL_HISTORY_INFORMATION="Informations sur les antécédents sociaux";
i18n.SOURCE="Source";
i18n.SOURCE_BODY_SITE="Source/Site de prélèvement";
i18n.SOURCE_SITE="Source/Site de prélèvement";
i18n.START="Commencer";
i18n.START_DT_TM="Date/Heure de début";
i18n.STATUS="Statut";
i18n.STATUS_DATE="Date/Heure du statut";
i18n.STICKY_NOTES="Mémos";
i18n.STOP="Arrêter";
i18n.STOP_DT_TM="Date/Heure d'arrêt";
i18n.STOP_REASON="Motif d'arrêt";
i18n.STUDY="Étude";
i18n.SUBJECT="Objet";
i18n.SUBMIT_FOR_SIGNATURE="Soumettre pour signature";
i18n.SURGEON="Chirurgien";
i18n.SURGERY_START="Début de l'intervention chirurgicale";
i18n.SURGERY_STOP="Fin de l'intervention chirurgicale";
i18n.SURGICAL_FREE_TEXT="Texte libre à propos de l'intervention chirurgicale";
i18n.SUSCEPTIBILITY="Sensibilité";
i18n.SUSC_HEADER="SC";
i18n.SUSPENDED="Interrompu";
i18n.TABLE_GRAPH_DISCLAIMER="Les dernières valeurs documentées apparaissent dans la table correspondant à la période indiquée.";
i18n.TARGETED_DISCHARGE_DATE="Date cible de sortie";
i18n.TARGET_DISCH_DT_TM="Date/Heure cibles de sortie";
i18n.TEMPERATURE="Température";
i18n.TERTIARY="Tertiaire";
i18n.TEXT="Texte";
i18n.TOTAL_FL_BAL="Équilibre électrolytique total";
i18n.TOTAL_FL_INTAKE="Entrées de liquide totales";
i18n.TOTAL_FL_OUTPUT="Sorties de liquide totales";
i18n.TOTAL_MINUTE_VOLUME="Ventilation minute totale";
i18n.TOTAL_RESPIRATORY_RATE="Fréquence respiratoire totale";
i18n.TRANSFER_OF_CARE_PACKET="Transfert de la pochette de soins";
i18n.TRANSFUSIONS="Transfusions";
i18n.TRANSFUSION_DATE="Date de transfusion";
i18n.TRANSFUSION_EVENT_CD="Event code de transfusion";
i18n.TRANSFUSION_RESULT_VAL="Valeur du résultat";
i18n.TRANSPLANT_DATE="Date de la transplantation";
i18n.TRANSPORATION_ARRANGED="Transport organisé";
i18n.TUBES_DRAINS="Tubes/Drains";
i18n.TWO_DAY_MAX="48 heures maximum";
i18n.TYPE="Type";
i18n.UNABLE_TO_OBTAIN_MED_HIST="Impossible d'obtenir des informations relatives à l'historique des médicaments pour la consultation sélectionnée.";
i18n.UNIT_OF_MEASURE="Unité de mesure";
i18n.UNKNOWN="Inconnu";
i18n.UNSCHEDULED="Non planifié";
i18n.USER_CUSTOMIZATION="Personnalisation par l'utilisateur";
i18n.USER_CUST_DISCLAIMER="Veuillez prendre en compte la résolution de l'écran avant de sélectionner la vue répartie sur trois colonnes.";
i18n.VENTILATOR_INFO="Données du respirateur";
i18n.VENTILATOR_MODE="Mode respirateur";
i18n.VENT_ALARMS_ON="Alarmes respirateur activées et fonctionnelles";
i18n.VENT_ID="ID de respirateur/machine";
i18n.VENT_MODE="Mode respirateur";
i18n.VENT_MODEL="Modèle de respirateur/machine";
i18n.VISIT="Consultation";
i18n.VISIT="Consultation";
i18n.VISIT_DETAILS="Détails de la consultation";
i18n.VISIT_REASON="Motif de venue";
i18n.VITALS_TABLE="Tableau des signes vitaux";
i18n.WEANING_PARAMETERS="Paramètres de sevrage";
i18n.WEANING_PARAMETERS_DETAILS="Informations sur les paramètres de sevrage";
i18n.WITHIN="dans";
i18n.WITHIN_DAYS="{0} jours";
i18n.WITHIN_HOURS="{0} hres";
i18n.WITHIN_MINS="{0} min";
i18n.WITHIN_MONTHS="{0} mois";
i18n.WITHIN_WEEKS="{0} sem.";
i18n.WITHIN_YEARS="{0} ans";
i18n.ZSCORE="Note Z";
if(typeof i18n.discernabu=="undefined"){i18n.discernabu={};
}i18n.discernabu.ADD="Ajouter";
i18n.discernabu.ALL_N_VISITS="{0} pour toutes les consultations";
i18n.discernabu.All_VISITS="Toutes les consultations";
i18n.discernabu.CLEAR_PREFERENCES="Effacer les préférences";
i18n.discernabu.COLLAPSE_ALL="Réduire tout";
i18n.discernabu.CUSTOMIZE="Personnaliser";
i18n.discernabu.DAYNAMES=["dim","lun","mar","mer","jeu","ven","sam","dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];
i18n.discernabu.DESCRIPTION="Description";
i18n.discernabu.DIAGNOSIS="Diagnostic";
i18n.discernabu.DISCERN_ERROR="Erreur Discern";
i18n.discernabu.DISCLAIMER="Cette page ne comprend pas toutes les informations sur le séjour.";
i18n.discernabu.DUPLICATE="Cette action créera un(e) {name} en double. Vous ne pouvez ajouter ce/cette {name}.";
i18n.discernabu.ERROR_OPERATION="Nom de l'opération";
i18n.discernabu.ERROR_OPERATION_STATUS="Statut de l'opération";
i18n.discernabu.ERROR_RETREIVING_DATA="Erreur de récupération des résultats";
i18n.discernabu.ERROR_TARGET_OBJECT="Nom de l'objet cible";
i18n.discernabu.ERROR_TARGET_OBJECT_VALUE="Valeur de l'objet cible";
i18n.discernabu.EXPAND_ALL="Développer tout";
i18n.discernabu.GO_TO_TAB="Aller à l''onglet {0}";
i18n.discernabu.HELP="Aide";
i18n.discernabu.HIDE_SECTION="Réduire";
i18n.discernabu.JS_ERROR="Erreur JavaScript";
i18n.discernabu.LAST_N_DAYS="{0} derniers jours";
i18n.discernabu.LAST_N_HOURS="{0} dernières heures";
i18n.discernabu.LAST_N_MONTHS="{0} derniers mois";
i18n.discernabu.LAST_N_WEEKS="{0} dernières semaines";
i18n.discernabu.LAST_N_YEARS="{0} dernières années";
i18n.discernabu.LOADING_DATA="Chargement";
i18n.discernabu.MESSAGE="Message";
i18n.discernabu.MONTHNAMES=["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc","Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
i18n.discernabu.NAME="Nom";
i18n.discernabu.NO_PRIVS="Vous n''êtes pas autorisé à ajouter la/le {name} sélectionné(e).";
i18n.discernabu.NO_RESULTS_FOUND="Aucun résultat n'a été trouvé.";
i18n.discernabu.NUMBER="Numéro";
i18n.discernabu.PROBLEM="Problème";
i18n.discernabu.RENDERING_DATA="Rendu";
i18n.discernabu.REQUEST="Requête";
i18n.discernabu.SAVE_PREFERENCES="Enregistrer les préférences";
i18n.discernabu.SELECTED_N_VISIT="{0} pour la consultation sélectionnée";
i18n.discernabu.SELECTED_VISIT="Consultation sélectionnée";
i18n.discernabu.SHOW_SECTION="Développer";
i18n.discernabu.STATUS="Statut";
i18n.discernabu.USER_CUSTOMIZATION="Personnalisation par l'utilisateur";
i18n.discernabu.USER_CUST_DISCLAIMER="Veuillez prendre en compte la résolution de l'écran avant de sélectionner la vue répartie sur trois colonnes.";
i18n.discernabu.WITHIN_DAYS="{0} jours";
i18n.discernabu.WITHIN_HOURS="{0} hres";
i18n.discernabu.WITHIN_MINS="{0} min";
i18n.discernabu.WITHIN_MONTHS="{0} mois";
i18n.discernabu.WITHIN_WEEKS="{0} sem.";
i18n.discernabu.WITHIN_YEARS="{0} ans";
i18n.discernabu.X_DAYS="{0} jours";
i18n.discernabu.X_HOURS="{0} heure(s)";
i18n.discernabu.X_MINUTES="{0} minute(s)";
i18n.discernabu.X_MONTHS="{0} mois";
i18n.discernabu.X_WEEKS="{0} semaine(s)";
i18n.discernabu.X_YEARS="{0} an(s)";
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
