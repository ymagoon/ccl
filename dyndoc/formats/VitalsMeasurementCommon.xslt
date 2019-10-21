<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="1.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:fo="http://www.w3.org/1999/XSL/Format"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:n="urn:com-cerner-patient-ehr:v3"
	xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
	xmlns:extfx="urn:com-cerner-physician-documentation-extension-functions"
	xmlns:saxon="http://saxon.sf.net/"
	xmlns:dd="DynamicDocumentation"
	xmlns:java-string="java:java.lang.String"
	xmlns:doc="java:com.cerner.documentation.extension.XSLTFuncs"
	xmlns:xr-date-formatter="java:com.cerner.xsl.util.XSLTDateUtilities"
	saxon:allow-all-built-in-types="yes"
	exclude-result-prefixes="xsl xs fn fo n cdocfx doc extfx saxon java-string xr-date-formatter">
	 
	<!-- While debugging in XMLSpy, replace xmlns:java-string namespace above with the following line and ensure that path is appropriately modified to point to rt.jar -->
	<!-- xmlns:java-string="java:java.lang.String?path=jar:file:///C:/Java/jre1.5.0_22/lib/rt.jar!/" -->

	<xsl:output method="html" encoding="UTF-8" indent="yes" />
	<xsl:param name="current-locale" as="xs:string" select="'en_US'" />

	<!-- Required to include CommonFxn.xslt -->
	<!-- Comment this line to debug --><xsl:include href="/cernerbasiccontent/formats/commonfxn.xslt" /> 
	<!-- Uncomment this line to debug  <xsl:include href="commonfxn.xslt" /> -->

	<!-- This will be over-written during Run-Time -->
	<xsl:variable name="bIsUTCOn" as="xs:boolean" select="true()"/>

	<!-- Default string constants -->
	<xsl:variable name="DATE_SEQUENCE_UTC_ON" as="xs:string" select="'MM/dd/yyyy HH:mm zzz'"/>
	<xsl:variable name="DATE_SEQUENCE_UTC_OFF" as="xs:string" select="'MM/dd/yyyy HH:mm'"/>
	<xsl:variable name="maxTemp" as="xs:string">
		<xsl:value-of select="'TMAX'"/>
	</xsl:variable>
	<xsl:variable name="minTemp" as="xs:string">
		<xsl:value-of select="'TMIN'"/>
	</xsl:variable>
	<xsl:variable name="AbbreviationDisplay" as="xs:string">
		<xsl:value-of select="'%s:'"/>
	</xsl:variable>
	<xsl:variable name="OrthoAbbreviationDisplay" as="xs:string">
		<xsl:value-of select="'%s'"/>
	</xsl:variable>
	<xsl:variable name="MethodDisplay" as="xs:string">
		<xsl:value-of select="'(%s)'"/>
	</xsl:variable>
	<xsl:variable name="birth" as="xs:string">
		<xsl:value-of select="'(Birth)'"/>
	</xsl:variable>
	<!-- Degree Celsius unicode representation, Link to html codes: http://www.w3.org/TR/WD-html40-970708/sgml/entities.html -->
	<xsl:variable name="DegreeCelsius" ><![CDATA[&#176;]]>C</xsl:variable>
	<!-- Degree Fahrenheit unicode representation, Link to html codes: http://www.w3.org/TR/WD-html40-970708/sgml/entities.html -->
	<xsl:variable name="DegreeFahrenheit" ><![CDATA[&#176;]]>F</xsl:variable>
	
	<!--For Visit Summary and Patient Facing templates we will display vital signs differently.
	For Patient Facing templates the value of isPatientFacingTemplate boolean will be true, else false.-->
	<xsl:variable name="isPatientFacingTemplate" as="xs:boolean" select="false()"/>
	
	<!-- Default string constants -->
	<!-- Abbreviations -->
	<xsl:variable name="sAbbrvTemperature" as="xs:string" select="'T'"/>
	<xsl:variable name="sAbbrvHeartRate" as="xs:string" select="'HR'"/>
	<xsl:variable name="sAbbrvRespiratoryRate" as="xs:string" select="'RR'"/>
	<xsl:variable name="sAbbrvBloodPressure" as="xs:string" select="'BP'"/>
	<xsl:variable name="sAbbrvOrthoBloodPressure" as="xs:string" select="'Orthostatic BP'"/>
	<xsl:variable name="sAbbrvSpO2" as="xs:string" select="'SpO2'"/>
	<xsl:variable name="sAbbrvHeight" as="xs:string" select="'HT'"/>
	<xsl:variable name="sAbbrvWeight" as="xs:string" select="'WT'"/>
	<xsl:variable name="sAbbrvBMI" as="xs:string" select="'BMI'"/>
	<xsl:variable name="sAbbrvICP" as="xs:string" select="'ICP'"/>
	<xsl:variable name="sAbbrvGCS" as="xs:string" select="'GCS Score'"/>
	<xsl:variable name="sAbbrvNIH" as="xs:string" select="'NIH Stroke Scale Score'"/>
	<xsl:variable name="sAbbrvPVR" as="xs:string" select="'PVR'"/>
	<xsl:variable name="sAbbrvOrthoHeartRate" as="xs:string" select="'Orthostatic HR'"/>
	
	<!-- Methods -->
	<xsl:variable name="sMthdEmpty" as="xs:string" select="''"/>
	<xsl:variable name="sMthdAxillary" as="xs:string" select="'Axillary'"/>
	<xsl:variable name="sMthdBladder" as="xs:string" select="'Bladder'"/>
	<xsl:variable name="sMthdBrain" as="xs:string" select="'Brain'"/>
	<xsl:variable name="sMthdEsophageal" as="xs:string" select="'Esophageal'"/>
	<xsl:variable name="sMthdIntravascular" as="xs:string" select="'Intravascular'"/>
	<xsl:variable name="sMthdOral" as="xs:string" select="'Oral'"/>
	<xsl:variable name="sMthdRectal" as="xs:string" select="'Rectal'"/>
	<xsl:variable name="sMthdSkin" as="xs:string" select="'Skin'"/>
	<xsl:variable name="sMthdTemporalArtery" as="xs:string" select="'Temporal Artery'"/>
	<xsl:variable name="sMthdTympanic" as="xs:string" select="'Tympanic'"/>
	<xsl:variable name="sMthdCore" as="xs:string" select="'Core'"/>
	<xsl:variable name="sMthdApical" as="xs:string" select="'Apical'"/>
	<xsl:variable name="sMthdMonitored" as="xs:string" select="'Monitored'"/>
	<xsl:variable name="sMthdApnea" as="xs:string" select="'Apnea'"/>
	<xsl:variable name="sMthdSpontaneous" as="xs:string" select="'Spontaneous'"/>
	<xsl:variable name="sMthdtotal" as="xs:string" select="'Total'"/>
	<xsl:variable name="sMthdactivity" as="xs:string" select="'Activity'"/>
	<xsl:variable name="sMthdassisted" as="xs:string" select="'Assisted'"/>
	<xsl:variable name="sMthdcuff" as="xs:string" select="'Cuff'"/>
	<xsl:variable name="sMthdline" as="xs:string" select="'Line'"/>
	<xsl:variable name="sMthdsitting" as="xs:string" select="'Sitting'"/>
	<xsl:variable name="sMthdstanding" as="xs:string" select="'Standing'"/>
	<xsl:variable name="sMthdsupine" as="xs:string" select="'Supine'"/>
	<xsl:variable name="sMthdPeripheral" as="xs:string" select="'Peripheral'"/>
	
	<xsl:variable name="bIncludeEDVitals" as="xs:boolean" select="false()"/>
	<xsl:variable name="bIncludeOrthoVitals" as="xs:boolean" select="false()"/>
	
	<!-- This is a derived variable and doesn't need to go in the i18n string tables -->
	<xsl:variable name="DATE_SEQUENCE" as="xs:string" select="cdocfx:getDateDisplayPattern($bIsUTCOn, $DATE_SEQUENCE_UTC_ON, $DATE_SEQUENCE_UTC_OFF)"/>

	<!-- vitalMeasurement defines the type of measurement that this format file will handle. It also groups concep CKIs of
			a measurement together and map each concept cki to the method display (if exists). In blood pressure
			measurement, it also pair the Systolic and Diastolic result.
			Element and attributes:
			measurement-concept: This element defines a measurement with display and a list of concept ckis
			measurement-concept/@type: Identify type of this measurement. Do NOT modify.
			measurement-concept/abbreviation: Measurement abbreviation displayed in the output HTML. (i18n)
			concepts: Contains all concept CKIs of this measurement
			concept: This element defines a concept CKI with the method display
			concept/@key: concept CKI of this concept (Systolic blood pressure for blood pressure measurement). Do NOT modify
			method: method display of concept, (optional, i18n)
			concept/@dbp: for blood pressure measurement only, the concept cki of pair Diastolic blood pressure. Do Not modify
			Sample measurement display:
					TP: 98.4 BP: 120/80 (standing)
			"TP" and "BP" are defined by measurement-concept/abbreviation, 
			"standing" is defined by measurement-concept/concepts/concept/method. Temperature in the above example doesn't have a method defined. -->
	
	<xsl:variable name="vitalMeasurement">
		<!-- Map Temperature concept CKI to method display -->
		<measurement-concept type="Temperature"> <!-- Temperature -->
			<abbreviation><xsl:value-of select="$sAbbrvTemperature"/></abbreviation>
			<concepts>
				<concept key="CERNER!AC6aqgEDbA0M1oCfn4waeg">
					<method><xsl:value-of select="$sMthdEmpty"/></method>
				</concept>
				<concept key="CERNER!AC6aqgEDbA0M1oCnn4waeg">
					<method><xsl:value-of select="$sMthdAxillary"/></method>
				</concept>
				<concept key="CERNER!AC6aqgEDbA0M1oCvn4waeg">
					<method><xsl:value-of select="$sMthdBladder"/></method>
				</concept>
				<concept key="CERNER!AC6aqgEDbA0M1oC3n4waeg">
					<method><xsl:value-of select="$sMthdBrain"/></method>
				</concept>
				<concept key="CERNER!AC6aqgEDbA0M1oC/n4waeg">
					<method><xsl:value-of select="$sMthdEsophageal"/></method>
				</concept>
				<concept key="CERNER!AC6aqgEDbA0M1oDHn4waeg">
					<method><xsl:value-of select="$sMthdIntravascular"/></method>
				</concept>
				<concept key="CERNER!AC6aqgEDbA0M1oDPn4waeg">
					<method><xsl:value-of select="$sMthdOral"/></method>
				</concept>
				<concept key="CERNER!AC6aqgEDbA0M1oDXn4waeg">
					<method><xsl:value-of select="$sMthdRectal"/></method>
				</concept>
				<concept key="CERNER!AE8dDQEYUgbeg4GXCqIGfA">
					<method><xsl:value-of select="$sMthdSkin"/></method>
				</concept>
				<concept key="CERNER!0BF8678F-E5DD-4342-BED7-BAC7F7C7ECA0">
					<method><xsl:value-of select="$sMthdTemporalArtery"/></method>
				</concept>
				<concept key="CERNER!AC6aqgEDbA0M1oDfn4waeg">
					<method><xsl:value-of select="$sMthdTympanic"/></method>
				</concept>
				<concept key="CERNER!ANyj7QEXgx8NqoKxCqIGfQ">
					<method><xsl:value-of select="$sMthdCore"/></method>
				</concept>
			</concepts>
		</measurement-concept>
		
		<!-- Map Heart Rate concept CKI to method display -->
		<measurement-concept type="HeartRate">
			<abbreviation><xsl:value-of select="$sAbbrvHeartRate"/></abbreviation>
			<concepts>
				<concept key="CERNER!2999B67B-A644-4BF5-A01A-DB973CC97AF4">
					<method><xsl:value-of select="$sMthdEmpty"/></method>
				</concept>
				<concept key="CERNER!AC6aqgEDbA0M1oB3n4waeg">
					<method><xsl:value-of select="$sMthdApical"/></method>
				</concept>
				<concept key="CERNER!AC6aqgEDbA0M1oB/n4waeg">
					<method><xsl:value-of select="$sMthdMonitored"/></method>
				</concept>
				<concept key="CERNER!76B85B38-85AF-415E-AA04-730D11F13A90">
					<method><xsl:value-of select="$sMthdMonitored"/></method>
				</concept>
				<concept key="CERNER!596EC6F6-BEA7-499E-ACCF-DC064F4F651F">
					<method><xsl:value-of select="$sMthdMonitored"/></method>
				</concept>
				<concept key="CERNER!D7E0BC69-0675-41C7-B83C-0F2D0A202B93">
					<method><xsl:value-of select="$sMthdApnea"/></method>
				</concept>
				<concept key="CERNER!AC6aqgEDbA0M1oCHn4waeg">
					<method><xsl:value-of select="$sMthdPeripheral"/></method>
				</concept>
			</concepts>
		</measurement-concept>
			
		<!-- Map Orthostatic Heart Rate concept CKI to method display -->
		<measurement-concept type="OrthoHeartRate">
			<abbreviation><xsl:value-of select="$sAbbrvHeartRate"/></abbreviation>
			<concepts>
				<concept key="CERNER!AKUJFgEW6OV+moHwCqIGfQ">
					<method><xsl:value-of select="$sMthdsitting"/></method>
				</concept>
				<concept key="CERNER!AKUJFgEW6OV+moIUCqIGfQ">
					<method><xsl:value-of select="$sMthdstanding"/></method>
				</concept>
				<concept key="CERNER!AKUJFgEW6OV+moHMCqIGfQ">
					<method><xsl:value-of select="$sMthdsupine"/></method>
				</concept>
			</concepts>
		</measurement-concept>
		
		<!-- Map Respiratory Rate concept CKI to method display -->
		<measurement-concept type="RespiratoryRate">
			<abbreviation><xsl:value-of select="$sAbbrvRespiratoryRate"/></abbreviation>
			<concepts>
				<concept key="CERNER!AC6aqgEDbA0M1oCPn4waeg">
					<method><xsl:value-of select="$sMthdEmpty"/></method>
				</concept>
				<concept key="CERNER!AE8dDQEYUgbeg4J+CqIGfA">
					<method><xsl:value-of select="$sMthdSpontaneous"/></method>
				</concept>
				<concept key="CERNER!BC645770-7402-4E46-B26D-94EE10D9AE6A">
					<method><xsl:value-of select="$sMthdtotal"/></method>
				</concept>
				<concept key="CERNER!B76FB95A-E487-45FF-9D09-2E39BCD8C021">
					<method><xsl:value-of select="$sMthdactivity"/></method>
				</concept>
			</concepts>
		</measurement-concept>
		
		<!-- Map Systolic Blood Pressure concept CKI to Diastolic Blood Presure concept CKI and method display -->
		<measurement-concept type="BloodPressure"> <!-- Blood Pressure -->
			<abbreviation><xsl:value-of select="$sAbbrvBloodPressure"/></abbreviation>
			<concepts>
				<concept key="CERNER!AE2lmwD9a+OCboD/n4waeg" dbp="CERNER!AE2lmwD9a+OCboERn4waeg">
					<method><xsl:value-of select="$sMthdEmpty"/></method>
				</concept>
				<concept key="CERNER!AE8dDQEYUgbeg4FrCqIGfA" dbp="CERNER!AE8dDQEYUgbeg4F2CqIGfA">
					<method><xsl:value-of select="$sMthdassisted"/></method>
				</concept>
				<concept key="CERNER!ANyj7QEXgx8NqoLnCqIGfQ" dbp="CERNER!ANyj7QEXgx8NqoLwCqIGfQ">
					<method><xsl:value-of select="$sMthdcuff"/></method>
				</concept>
				<concept key="CERNER!AC6aqgEDbA0M1oCXn4waeg" dbp="CERNER!AE8dDQEYUgbeg4GiCqIGfA">
					<method><xsl:value-of select="$sMthdline"/></method>
				</concept>
			</concepts>
		</measurement-concept>
		
		<!-- Map Ortostatic Systolic Blood Pressure concept CKI to Diastolic Blood Presure concept CKI and method display -->
		<measurement-concept type="OrthoBloodPressure"> <!-- Blood Pressure -->
			<abbreviation><xsl:value-of select="$sAbbrvBloodPressure"/></abbreviation>
			<concepts>
				<concept key="CERNER!AKUJFgEW6OV+moHYCqIGfQ" dbp="CERNER!AKUJFgEW6OV+moHkCqIGfQ">
					<method><xsl:value-of select="$sMthdsitting"/></method>
				</concept>
				<concept key="CERNER!AKUJFgEW6OV+moH8CqIGfQ" dbp="CERNER!AKUJFgEW6OV+moIICqIGfQ">
					<method><xsl:value-of select="$sMthdstanding"/></method>
				</concept>
				<concept key="CERNER!AKUJFgEW6OV+moG0CqIGfQ" dbp="CERNER!AKUJFgEW6OV+moG9CqIGfQ">
					<method><xsl:value-of select="$sMthdsupine"/></method>
				</concept>
			</concepts>
		</measurement-concept>
		
		<!-- Map Pulse Ox concept CKI to method display -->
		<measurement-concept type="SpO2">
			<abbreviation><xsl:value-of select="$sAbbrvSpO2"/></abbreviation>
			<concepts>
				<concept key="CERNER!AC6aqgEDbA0M1oEnn4waeg">
					<method><xsl:value-of select="$sMthdEmpty"/></method>
				</concept>
				<concept key="CERNER!AE8dDQEYUgbeg4OnCqIGfA">
					<method><xsl:value-of select="$sMthdEmpty"/></method>
				</concept>
			</concepts>
		</measurement-concept>
		
		<!-- Map Height concept CKI to method display -->
		<measurement-concept type="Height">
			<abbreviation><xsl:value-of select="$sAbbrvHeight"/></abbreviation>
			<concepts>
				<concept key="CERNER!AHi9DQD6D9YGkYA0n4waeg">
					<method><xsl:value-of select="$sMthdEmpty"/></method>
				</concept>
				<concept key="CERNER!141844AD-D931-4C4F-94DA-59A2A0CB5255">
					<method><xsl:value-of select="$sMthdEmpty"/></method>
				</concept> <!-- dosing -->
				<concept key="CERNER!EE30384E-7757-41E9-8DB6-A89980F9BA4A">
					<method><xsl:value-of select="$sMthdEmpty"/></method>
				</concept> <!-- measured -->
				<concept key="CERNER!1A8B0C32-D104-4914-8A69-D83AB76F0E64">
					<method><xsl:value-of select="$sMthdEmpty"/></method>
				</concept> <!-- estimated -->
			</concepts>
		</measurement-concept>
		
		<!-- Map Weight concept CKI to method display -->
		<measurement-concept type="Weight">
			<abbreviation><xsl:value-of select="$sAbbrvWeight"/></abbreviation>
			<concepts>
				<concept key="CERNER!ASYr9AEYvUr1YoRMCqIGfQ">
					<method><xsl:value-of select="$sMthdEmpty"/></method>
				</concept>
				<concept key="CERNER!ANyj7QEXgx8NqoDOCqIGfQ">
					<method><xsl:value-of select="$sMthdEmpty"/></method>
				</concept> <!-- actual -->
				<concept key="CERNER!E9A8D345-C87A-4034-938A-BA2349967398">
					<method><xsl:value-of select="$sMthdEmpty"/></method>
				</concept> <!-- measured -->
				<concept key="CERNER!231D4897-58D8-4E6E-9B6A-C83764DE3E92">
					<method><xsl:value-of select="$sMthdEmpty"/></method>
				</concept> <!-- measured -->
				<concept key="CERNER!ABfQJgD4st77Y5Aqn4waeg">
					<method><xsl:value-of select="$sMthdEmpty"/></method>
				</concept> <!-- dosing -->
				<concept key="CERNER!12E623D3-3A0A-4F8E-8316-7B345FA457D0">
					<method><xsl:value-of select="$sMthdEmpty"/></method>
				</concept> <!-- this visit -->
			</concepts>
		</measurement-concept>
		
		<!-- Map BMI concept CKI to method display -->
		<measurement-concept type="BMI">
			<abbreviation><xsl:value-of select="$sAbbrvBMI"/></abbreviation>
			<concepts>
				<concept key="CERNER!ASYr9AEYvUr1YoB1CqIGfQ">
					<method><xsl:value-of select="$sMthdEmpty"/></method>
				</concept> <!-- measured -->
				<concept key="CERNER!8BBF4EE4-A443-4E6E-B1DC-04378D885AAC">
					<method><xsl:value-of select="$sMthdEmpty"/></method>
				</concept> <!-- estimated -->
			</concepts>
		</measurement-concept>
		
		<!-- Map ICP concept CKI to method display -->
		<measurement-concept type="IntracranialPressure">
			<abbreviation><xsl:value-of select="$sAbbrvICP"/></abbreviation>
			<concepts>
				<concept key="CERNER!ANyj7QEXgx8NqoK6CqIGfQ">
					<method><xsl:value-of select="$sMthdEmpty"/></method>
				</concept>
			</concepts>
		</measurement-concept>
		
		<!-- Map GCS concept CKI to method display -->
		<measurement-concept type="GlasgowComaScore">
			<abbreviation><xsl:value-of select="$sAbbrvGCS"/></abbreviation>
			<concepts>
				<concept key="CERNER!9822A833-C669-4286-A2FA-0CBC583CFEB4">
					<method><xsl:value-of select="$sMthdEmpty"/></method>
				</concept>
			</concepts>
		</measurement-concept>
		
		<!-- Map NIH concept CKI to method display -->
		<measurement-concept type="NIHStrokeScore">
			<abbreviation><xsl:value-of select="$sAbbrvNIH"/></abbreviation>
			<concepts>
				<concept key="CERNER!FE266627-7FA8-4559-95AB-BC70CAD955F3">
					<method><xsl:value-of select="$sMthdEmpty"/></method>
				</concept>
			</concepts>
		</measurement-concept>
		
		<!-- Map PVR concept CKI to method display -->
		<measurement-concept type="PostVoidResidual">
			<abbreviation><xsl:value-of select="$sAbbrvPVR"/></abbreviation>
			<concepts>
				<concept key="CERNER!146698C6-25B4-499A-90E5-08824DBCC980">
					<method><xsl:value-of select="$sMthdEmpty"/></method>
				</concept>
			</concepts>
		</measurement-concept>
		
	</xsl:variable>

	<!-- Functions -->

	<!-- Detect if any of given event type concept CKI matches one of the given concept CKIs -->
	<!-- Parameters: -->
	<!-- 	eventTypes - a list of the event-type node -->
	<!--	conceptCKIs - array of vital sign/measurement concept CKIs -->
	<xsl:function name="cdocfx:isTypeOf" as="xs:boolean">
		<xsl:param name="eventType"/>
		<xsl:param name="conceptCKIs"/>
		<xsl:variable name="ConceptCKI" select="cdocfx:getEventTypeConceptCki($eventType)"/>
		<xsl:value-of select="fn:exists(fn:index-of($conceptCKIs,$ConceptCKI))"/>
	</xsl:function>

	<!-- Function Name : cdocfx:displayBirthWeight -->
	<!-- Param 1 Name  : birth date of the patient -->
	<!-- Param 2 Name  : event end date time of the particular measurement -->
	<!-- Description   : This function just decides whether to display the birth weight -->
	<!-- its based on the two conditions 1. if age of the patient age less than 2 years(730 days), returns true -->
	<!-- 2.if event end date time of a particular measurement is less than 2 years(730 days), returns true -->
	<!-- other conditions it returns false -->
	<xsl:function name="cdocfx:displayBirthWeight">
		<xsl:param name="birthDate" as="xs:string"/>
		<xsl:param name="eventEndDtTm" as="xs:string"/>
		
		<xsl:choose>
			<xsl:when test="$birthDate">
				<xsl:choose>
					<xsl:when test="cdocfx:noOfDaysBetRecDateAndCurrDate($birthDate)&lt; 730 ">
						<xsl:value-of select="fn:true()"/>
					</xsl:when>
					<xsl:otherwise>
					    <xsl:value-of select="fn:false()"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
		    <xsl:when test="$eventEndDtTm and cdocfx:noOfDaysBetRecDateAndCurrDate($eventEndDtTm)&lt; 730" >
			    <xsl:value-of select="fn:true()"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="fn:false()"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>
	
	<!-- Get ConceptCKI. Return the value if attribute exists, otherwise return empty string -->
	<xsl:function name="cdocfx:getEventTypeConceptCki">
		<xsl:param name="eventType"/>
		<xsl:choose>
			<xsl:when test="$eventType/@concept-cki">
				<xsl:value-of select="$eventType/@concept-cki"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="''"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>
	
	<!-- Get temperature measurement value in DegF from given value node. If the value is in DefC, convert it to DegF. -->
	<!-- Parameters: -->
	<!-- 	valueNode - the value node that holding temperature value and unit -->
	<xsl:function name="cdocfx:getTemperatureDegF" as="xs:double">
		<xsl:param name="valueNode"/>
		<xsl:choose>
			<xsl:when test="fn:exists($valueNode//n:quantity/@unit-code)">
				<xsl:variable name="mean" select="cdocfx:getCodeMeanByID($valueNode//n:quantity/@unit-code)"/>
				<xsl:choose>
					<xsl:when test="$mean='DEGF'">
						<xsl:value-of select="$valueNode/n:quantity/@value"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="$valueNode/n:quantity/@value*1.8+32"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise><xsl:value-of select="-1"/></xsl:otherwise>
		</xsl:choose>
	</xsl:function>

	<!-- Templates -->

	<!-- Format the given method display by adding parentheses around it -->
	<!-- Parameters: -->
	<!--   method - display of method -->
	<xsl:template name="tempMethod">
		<xsl:param name="method" as="xs:string"/>
		<xsl:if test="fn:string-length($method)>0">
			<xsl:value-of select="java-string:format($MethodDisplay, $method)"/>
		</xsl:if>
	</xsl:template>

	<!-- Format the given vital/measurement result as ddemrcontentitem -->
	<!-- Parameters: -->
	<!-- abbreviation - abbreviation of the vital sign/measurement, optional -->
	<!-- eventId - event id of the vital/measurement -->
	<!-- value - display value of the vital/measurement -->
	<!-- unit - unit display of the vital/measurement -->
	<!-- method - display of method; optional -->
	<!-- removable - indicate whether this measurement is removable or not -->
	<!-- appendSpace - indicate whether to append a space to the end of the display or not -->
	<!-- birthWeightDisplay - indicate whether to display the '(Birth)' for the birth weight measurement -->
	<xsl:template name="tempMeasurementDisplayInternal">
		<xsl:param name="abbreviation" as="xs:string"/>
		<xsl:param name="eventId" as="xs:string"/>
		<xsl:param name="value"/>
		<xsl:param name="unit" as="xs:string"/>
		<xsl:param name="method" as="xs:string"/>
		<xsl:param name="removable" as="xs:boolean"/>
		<xsl:param name="appendSpace" as="xs:boolean"/>
		<xsl:param name="birthWeightDisplay" as="xs:boolean"/>
		<span dd:contenttype="PATCARE_MEAS">
			<!-- Handle class attribute -->
			<xsl:attribute name="class">
				<xsl:choose>
					<xsl:when test="$removable"><xsl:value-of select="'ddemrcontentitem ddremovable'"/></xsl:when>
					<xsl:otherwise><xsl:value-of select="'ddemrcontentitem'"/></xsl:otherwise>
				</xsl:choose>
			</xsl:attribute>

			<!-- Handle entity id and value display -->
			<xsl:attribute name="dd:entityid"><xsl:value-of select="$eventId" /></xsl:attribute>
			<xsl:if test="fn:string-length($abbreviation)">
				<b><xsl:value-of select="java-string:format($AbbreviationDisplay, $abbreviation)"/><xsl:text disable-output-escaping="yes"><![CDATA[&#160;]]></xsl:text></b>
			</xsl:if>
			<xsl:value-of select="cdocfx:getMeasurementValueDisplay($value, $DATE_SEQUENCE)"/>
			
			<!-- Handle unit -->
			<xsl:if test="fn:string-length($unit)">
				<!-- Add a space between value and unit except when unit is % -->
				<xsl:if test="fn:not(fn:starts-with($unit, '%'))">
					<xsl:text disable-output-escaping="yes"><![CDATA[&#160;]]></xsl:text>
				</xsl:if>
				<!-- Add degree symbol to degree units-->
				<xsl:choose>
					<xsl:when test="$unit='DEGC'"><xsl:value-of select="$DegreeCelsius" disable-output-escaping="yes"/></xsl:when>
					<xsl:when test="$unit='DEGF'"><xsl:value-of select="$DegreeFahrenheit" disable-output-escaping="yes"/></xsl:when>
					<xsl:otherwise><xsl:value-of select="$unit"/></xsl:otherwise>
				</xsl:choose>
				<xsl:if test="$birthWeightDisplay">
					<xsl:text disable-output-escaping="yes"><![CDATA[&#160;]]></xsl:text>
					<xsl:value-of select="$birth"/>
				</xsl:if>
			</xsl:if>

			<!-- handle method -->
			<xsl:call-template name="tempMethod"><xsl:with-param name="method" select="$method"/></xsl:call-template>

			<!-- Append space at the end of this item -->
			<xsl:if test="$appendSpace">
				<xsl:text disable-output-escaping="yes"><![CDATA[&#160;]]></xsl:text>
				<xsl:text disable-output-escaping="yes"> </xsl:text>
			</xsl:if>
		</span>
	</xsl:template>
	
	<!-- Format the given vital/measurement result as ddemrcontentitem -->
	<!-- Parameters: -->
	<!-- abbreviation - abbreviation of the vital sign/measurement, optional -->
	<!-- eventId - event id of the vital/measurement -->
	<!-- value - display value of the vital/measurement -->
	<!-- unit - unit display of the vital/measurement -->
	<!-- method - display of method; optional -->
	<!-- removable - indicate whether this measurement is removable or not -->
	<!-- appendSpace - indicate whether to append a space to the end of the display or not -->
	<xsl:template name="tempMeasurementDisplay">
		<xsl:param name="abbreviation" as="xs:string"/>
		<xsl:param name="eventId" as="xs:string"/>
		<xsl:param name="value"/>
		<xsl:param name="unit" as="xs:string"/>
		<xsl:param name="method" as="xs:string"/>
		<xsl:param name="removable" as="xs:boolean"/>
		<xsl:param name="appendSpace" as="xs:boolean"/>
		
		<xsl:call-template name="tempMeasurementDisplayInternal">
			<xsl:with-param name="abbreviation" select="$abbreviation"/>
			<xsl:with-param name="eventId" select="$eventId"/>
			<xsl:with-param name="value" select="$value"/>
			<xsl:with-param name="unit" select="$unit"/>
			<xsl:with-param name="method" select="$method"/>
			<xsl:with-param name="removable" select="$removable"/>
			<xsl:with-param name="appendSpace" select="$appendSpace"/>
			<xsl:with-param name="birthWeightDisplay" select="fn:false()"/>
		</xsl:call-template>
		

	</xsl:template>
	
	<!-- Format the given vital/measurement result as ddemrcontentitem -->
	<!-- Parameters: -->
	<!-- abbreviation - abbreviation of the vital sign/measurement, optional -->
	<!-- eventId - event id of the vital/measurement -->
	<!-- value - display value of the vital/measurement -->
	<!-- unit - unit display of the vital/measurement -->
	<!-- method - display of method; optional -->
	<!-- removable - indicate whether this measurement is removable or not -->
	<!-- appendSpace - indicate whether to append a space to the end of the display or not -->
	<!-- birthWeightDisplay - indicate whether to display the '(Birth)' for the birth weight measurement -->
	<xsl:template name="tempMeasurementDisplayCommon">
		<xsl:param name="abbreviation" as="xs:string"/>
		<xsl:param name="eventId" as="xs:string"/>
		<xsl:param name="value"/>
		<xsl:param name="unit" as="xs:string"/>
		<xsl:param name="method" as="xs:string"/>
		<xsl:param name="removable" as="xs:boolean"/>
		<xsl:param name="appendSpace" as="xs:boolean"/>
		<xsl:param name="birthWeightDisplay" as="xs:boolean"/>
		
		<xsl:call-template name="tempMeasurementDisplayInternal">
			<xsl:with-param name="abbreviation" select="$abbreviation"/>
			<xsl:with-param name="eventId" select="$eventId"/>
			<xsl:with-param name="value" select="$value"/>
			<xsl:with-param name="unit" select="$unit"/>
			<xsl:with-param name="method" select="$method"/>
			<xsl:with-param name="removable" select="$removable"/>
			<xsl:with-param name="appendSpace" select="$appendSpace"/>
			<xsl:with-param name="birthWeightDisplay" select="$birthWeightDisplay"/>
		</xsl:call-template>
		

	</xsl:template>
		
	<!-- Format the given vital/measurement result as ddemrcontentitem for patient facing templates -->
	<!-- Parameters: -->
	<!-- abbreviation - abbreviation of the vital sign/measurement, optional -->
	<!-- eventId - event id of the vital/measurement -->
	<!-- value - display value of the vital/measurement -->
	<!-- unit - unit display of the vital/measurement -->
	<!-- method - display of method; optional -->
	<!-- appendSpace - indicate whether to append a space to the end of the display or not -->
	<!-- birthWeightDisplay - indicate whether to display the string "(Birth)" for the birth weight measurement -->
	<xsl:template name="tempMeasurementDisplayPtFacingInternal">
		<xsl:param name="abbreviation" as="xs:string"/>
		<xsl:param name="eventId" as="xs:string"/>
		<xsl:param name="value"/>
		<xsl:param name="unit" as="xs:string"/>
		<xsl:param name="method" as="xs:string"/>
		<xsl:param name="appendSpace" as="xs:boolean"/>
		<xsl:param name="birthWeightDisplay" as="xs:boolean"/>
		<span dd:contenttype="PATCARE_MEAS" class="ddemrcontentitem">

			<!-- Handle entity id and value display -->
			<xsl:attribute name="dd:entityid"><xsl:value-of select="$eventId" /></xsl:attribute>
			
			<xsl:if test="fn:string-length($abbreviation)">
				<span style="display:inline-block; padding-top:5px;">
					<span style="font-weight:bold">
						<xsl:value-of select="java-string:format($AbbreviationDisplay, $abbreviation)"/>
						<xsl:text disable-output-escaping="yes"><![CDATA[&#160;]]></xsl:text>
					</span>
					<!-- handle method -->
					<xsl:call-template name="tempMethod"><xsl:with-param name="method" select="$method"/></xsl:call-template>
				</span>
				<br/>
			</xsl:if>
			<span>
				<xsl:value-of select="cdocfx:getMeasurementValueDisplay($value, $DATE_SEQUENCE)"/>
				<!-- Handle unit -->
				<xsl:if test="fn:string-length($unit)">

					<!-- Add a space between value and unit except when unit is % -->
					<xsl:if test="fn:not(fn:starts-with($unit, '%'))">
						<xsl:text disable-output-escaping="yes"><![CDATA[&#160;]]></xsl:text>
					</xsl:if>
					<!-- Add degree symbol to degree units-->
					<xsl:choose>
						<xsl:when test="$unit='DEGC'"><xsl:value-of select="$DegreeCelsius" disable-output-escaping="yes"/></xsl:when>
						<xsl:when test="$unit='DEGF'"><xsl:value-of select="$DegreeFahrenheit" disable-output-escaping="yes"/></xsl:when>
						<xsl:when test="$unit='BPM'"><xsl:value-of select="'bpm'" disable-output-escaping="yes"/></xsl:when>
						<xsl:otherwise><xsl:value-of select="$unit"/></xsl:otherwise>
					</xsl:choose>
					<xsl:if test="$birthWeightDisplay">
						<xsl:text disable-output-escaping="yes"><![CDATA[&#160;]]></xsl:text>
						<xsl:value-of select="$birth"/>
					</xsl:if>
				</xsl:if>
			</span>
		</span>
	</xsl:template>
	
	<!-- Format the given vital/measurement result as ddemrcontentitem for patient facing templates -->
	<!-- Parameters: -->
	<!-- abbreviation - abbreviation of the vital sign/measurement, optional -->
	<!-- eventId - event id of the vital/measurement -->
	<!-- value - display value of the vital/measurement -->
	<!-- unit - unit display of the vital/measurement -->
	<!-- method - display of method; optional -->
	<!-- appendSpace - indicate whether to append a space to the end of the display or not -->
	<xsl:template name="tempMeasurementDisplayPtFacing">
		<xsl:param name="abbreviation" as="xs:string"/>
		<xsl:param name="eventId" as="xs:string"/>
		<xsl:param name="value"/>
		<xsl:param name="unit" as="xs:string"/>
		<xsl:param name="method" as="xs:string"/>
		<xsl:param name="appendSpace" as="xs:boolean"/>
		
		<xsl:call-template name="tempMeasurementDisplayPtFacingInternal">
			<xsl:with-param name="abbreviation" select="$abbreviation"/>
			<xsl:with-param name="eventId" select="$eventId"/>
			<xsl:with-param name="value" select="$value"/>
			<xsl:with-param name="unit" select="$unit"/>
			<xsl:with-param name="method" select="$method"/>
			<xsl:with-param name="appendSpace" select="$appendSpace"/>
			<xsl:with-param name="birthWeightDisplay" select="fn:false()"/>
		</xsl:call-template>
		
	</xsl:template>
	
	<!-- Format the given vital/measurement result as ddemrcontentitem for patient facing templates -->
	<!-- Parameters: -->
	<!-- abbreviation - abbreviation of the vital sign/measurement, optional -->
	<!-- eventId - event id of the vital/measurement -->
	<!-- value - display value of the vital/measurement -->
	<!-- unit - unit display of the vital/measurement -->
	<!-- method - display of method; optional -->
	<!-- appendSpace - indicate whether to append a space to the end of the display or not -->
	<!-- birthWeightDisplay - indicate whether to display the string "(Birth)" for the birth weight measurement -->
	<xsl:template name="tempMeasurementDisplayPtFacingCommon">
		<xsl:param name="abbreviation" as="xs:string"/>
		<xsl:param name="eventId" as="xs:string"/>
		<xsl:param name="value"/>
		<xsl:param name="unit" as="xs:string"/>
		<xsl:param name="method" as="xs:string"/>
		<xsl:param name="appendSpace" as="xs:boolean"/>
		<xsl:param name="birthWeightDisplay" as="xs:boolean"/>
		
		<xsl:call-template name="tempMeasurementDisplayPtFacingInternal">
			<xsl:with-param name="abbreviation" select="$abbreviation"/>
			<xsl:with-param name="eventId" select="$eventId"/>
			<xsl:with-param name="value" select="$value"/>
			<xsl:with-param name="unit" select="$unit"/>
			<xsl:with-param name="method" select="$method"/>
			<xsl:with-param name="appendSpace" select="$appendSpace"/>
			<xsl:with-param name="birthWeightDisplay" select="$birthWeightDisplay"/>
		</xsl:call-template>
		
	</xsl:template>
	
	<!-- Format common measurement node. Display unit after measurement value only for certain type of measurement. -->
	<!-- Parameters: -->
	<!-- measureConcept - the measurement-concept node -->
	<!-- abbreviation - the abbreviation that override concept abbreviation, optional -->
	<xsl:template name="handleMeasurements">
		<xsl:param name="measureConcept"/>
		<xsl:param name="abbreviation"/>
		<xsl:param name="birthDate"/>
		
		<!-- Iterate and display all latest measruements for each concept cki -->						
		<xsl:variable name ="LatestMeasurement">
			<xsl:for-each select = "$AllMeasurements/*[cdocfx:isTypeOf(n:event-type, $measureConcept/concepts/concept/@key)]">
				<xsl:sort select = "n:event-end-dt-tm" order="descending"/>
				<xsl:copy-of select="."/>
			</xsl:for-each>
		</xsl:variable>

		<xsl:for-each select ="$LatestMeasurement/*[n:event-end-dt-tm = $LatestMeasurement/*[1]/n:event-end-dt-tm]">
			<xsl:variable name="cki" select="n:event-type/@concept-cki"/>
			<xsl:variable name="conceptMap" select="$measureConcept/concepts/concept[@key=$cki]"/>
			<xsl:variable name="unit">
				<xsl:if test="fn:exists(n:value/n:quantity/@unit-code)">
					<xsl:choose>
						<xsl:when test="$measureConcept/@type='Height' or 
								$measureConcept/@type='Weight' or 
								$measureConcept/@type='SpO2' or
								$measureConcept/@type='IntracranialPressure' or
								$measureConcept/@type='PostVoidResidual'">
									<xsl:value-of select="cdocfx:getCodeDisplayByID(n:value/n:quantity/@unit-code)"/>
						</xsl:when>
						<xsl:when test="$measureConcept/@type='Temperature'">
							<xsl:value-of select="cdocfx:getCodeMeanByID(n:value/n:quantity/@unit-code)"/>
						</xsl:when>
					</xsl:choose>
				</xsl:if>
			</xsl:variable>
				
			<xsl:variable name="method">
				<xsl:choose>
					<xsl:when test="fn:exists($conceptMap) and $conceptMap[1]/method">
						<xsl:value-of select="$conceptMap[1]/method"/>
					</xsl:when>
					<xsl:otherwise><xsl:value-of select="''"/></xsl:otherwise>
				</xsl:choose>
			</xsl:variable>
			
			<xsl:variable name="birthWeightCKI" as="xs:string" select="'CERNER!ASYr9AEYvUr1YoRMCqIGfQ'"/>
			<xsl:choose>
        		<xsl:when test="$isPatientFacingTemplate = false()">
					<xsl:choose>
						<xsl:when test="n:event-type/@concept-cki != $birthWeightCKI">
							<xsl:call-template name="tempMeasurementDisplay">
								<xsl:with-param name="abbreviation" select="if(fn:string-length($abbreviation)>0) then $abbreviation else $measureConcept/abbreviation"/>
								<xsl:with-param name="eventId" select="@event-id"/>
								<xsl:with-param name="value" select="n:value"/>
								<xsl:with-param name="unit" select="$unit"/>
								<xsl:with-param name="method" select="$method"/>
								<xsl:with-param name="removable" select="fn:true()"/>
								<xsl:with-param name="appendSpace" select="fn:true()"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:choose>
								<xsl:when test="cdocfx:displayBirthWeight($birthDate,n:event-end-dt-tm) = true()" >
									<xsl:call-template name="tempMeasurementDisplayCommon">
										<xsl:with-param name="abbreviation" select="if(fn:string-length($abbreviation)>0) then $abbreviation else $measureConcept/abbreviation"/>
										<xsl:with-param name="eventId" select="@event-id"/>
										<xsl:with-param name="value" select="n:value"/>
										<xsl:with-param name="unit" select="$unit"/>
										<xsl:with-param name="method" select="$method"/>
										<xsl:with-param name="removable" select="fn:true()"/>
										<xsl:with-param name="appendSpace" select="fn:true()"/>
										<xsl:with-param name="birthWeightDisplay" select="fn:true()"/>
									</xsl:call-template>
								</xsl:when>
							</xsl:choose>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:when>
				<xsl:otherwise>
					<div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">
						<xsl:choose>
							<xsl:when test="n:event-type/@concept-cki != $birthWeightCKI">
								<xsl:call-template name="tempMeasurementDisplayPtFacing">
									<xsl:with-param name="abbreviation" select="if(fn:string-length($abbreviation)>0) then $abbreviation else $measureConcept/abbreviation"/>
									<xsl:with-param name="eventId" select="@event-id"/>
									<xsl:with-param name="value" select="n:value"/>
									<xsl:with-param name="unit" select="$unit"/>
									<xsl:with-param name="method" select="$method"/>
									<xsl:with-param name="appendSpace" select="fn:true()"/>
								</xsl:call-template>
							</xsl:when>
							<xsl:otherwise>
								<xsl:choose>
									<xsl:when test="cdocfx:displayBirthWeight($birthDate,n:event-end-dt-tm) = true ()">
										<xsl:call-template name="tempMeasurementDisplayPtFacingCommon">
											<xsl:with-param name="abbreviation" select="if(fn:string-length($abbreviation)>0) then $abbreviation else $measureConcept/abbreviation"/>
											<xsl:with-param name="eventId" select="@event-id"/>
											<xsl:with-param name="value" select="n:value"/>
											<xsl:with-param name="unit" select="$unit"/>
											<xsl:with-param name="method" select="$method"/>
											<xsl:with-param name="appendSpace" select="fn:true()"/>
											<xsl:with-param name="birthWeightDisplay" select="fn:true()"/>
										</xsl:call-template>
									</xsl:when>
								</xsl:choose>	
							</xsl:otherwise>
						</xsl:choose>
					</div>
				</xsl:otherwise>	
			</xsl:choose>
		</xsl:for-each>
	</xsl:template>

	<!-- Format maximum/minimum temperature measurement when has more than one temperature measurement. -->
	<!-- Parameters: -->
	<!--   measureConcept - the measurement-concept node -->
	<xsl:template name="handleMinMaxTemperature">
		<xsl:param name="measureConcept"/>
		
		<!-- Get all temperature measurements based on the matching measurement concept cki sorted based on temperature -->
		<xsl:variable name="CommonMeasurements">
			<xsl:for-each select="$AllMeasurements/*[cdocfx:isTypeOf(n:event-type, $measureConcept/concepts/concept/@key) and cdocfx:getTemperatureDegF(n:value) != -1]">
				<xsl:sort select="cdocfx:getTemperatureDegF(n:value)" order="ascending" />
				<xsl:copy-of select="."/>
			</xsl:for-each>
		</xsl:variable>
		
		<!-- Display min and max temperatures -->
		<xsl:for-each select="$CommonMeasurements/*">		
			<xsl:variable name="cki" select="n:event-type/@concept-cki"/>
			<xsl:variable name="conceptMap" select="$measureConcept/concepts/concept[@key=$cki]"/>
			<xsl:variable name="unit">
				<xsl:if test="fn:exists(n:value/n:quantity/@unit-code)">
					<xsl:value-of select="cdocfx:getCodeMeanByID(n:value/n:quantity/@unit-code)"/>
				</xsl:if>
			</xsl:variable>
			<xsl:variable name="method">
				<xsl:choose>
					<xsl:when test="fn:exists($conceptMap) and $conceptMap[1]/method">
						<xsl:value-of select="$conceptMap[1]/method"/>
					</xsl:when>
					<xsl:otherwise><xsl:value-of select="''"/></xsl:otherwise>
				</xsl:choose>
			</xsl:variable>
			
			<xsl:choose>
				<xsl:when test="fn:position()=1 and fn:position() != fn:last() and (n:value/n:quantity/@value != //n:value/n:quantity/@value[last()])"> <!-- Minimum temperature and has more than one temperature measurement -->
					<xsl:call-template name="tempMeasurementDisplay">
						<xsl:with-param name="abbreviation" select="if(fn:string-length($minTemp)>0) then $minTemp else $measureConcept/abbreviation"/>
						<xsl:with-param name="eventId" select="@event-id"/>
						<xsl:with-param name="value" select="n:value"/>
						<xsl:with-param name="unit" select="$unit"/>
						<xsl:with-param name="method" select="$method"/>
						<xsl:with-param name="removable" select="fn:true()"/>
						<xsl:with-param name="appendSpace" select="fn:true()"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="fn:position()=fn:last() and fn:position()!=1 and (n:value/n:quantity/@value != //n:value/n:quantity/@value[1])"> <!-- Maximum temperature -->
					<xsl:call-template name="tempMeasurementDisplay">
						<xsl:with-param name="abbreviation" select="if(fn:string-length($maxTemp)>0) then $maxTemp else $measureConcept/abbreviation"/>
						<xsl:with-param name="eventId" select="@event-id"/>
						<xsl:with-param name="value" select="n:value"/>
						<xsl:with-param name="unit" select="$unit"/>
						<xsl:with-param name="method" select="$method"/>
						<xsl:with-param name="removable" select="fn:true()"/>
						<xsl:with-param name="appendSpace" select="fn:true()"/>
					</xsl:call-template>
				</xsl:when>
			</xsl:choose>
		</xsl:for-each>	
	</xsl:template>

	<!-- Format Blood Pressure measurement. Display only latest measurements for a measurement concept method -->
	<!-- Parameters: -->
	<!--   measureConcept - the measurement-concept node -->
	<xsl:template name="handleBPs">
		<xsl:param name="measureConcept"/>
		
		<xsl:variable name="BPMeasurements" select="$AllMeasurements/*[cdocfx:isTypeOf(n:event-type, $measureConcept/concepts/concept/@key) or cdocfx:isTypeOf(n:event-type, $measureConcept/concepts/concept/@dbp)]"/>
		
		<xsl:if test="count($BPMeasurements/*) > 0">
		
			<!-- Create temp variable with structure that needs to be passed to Java extension function -->
			<xsl:variable name="javaRequest">
				<xsl:call-template name="buildMatchBPsRequest">
					<xsl:with-param name="measureConcept" select="$measureConcept"/>
				</xsl:call-template>
			</xsl:variable>

			<!-- Call java extension function to get matched blood pressures grouped by concept -->
			<xsl:variable name="matchedBPs" as="node()" select="doc:matchBPs($javaRequest)" />

			<!-- Display the matched blood pressures -->
			<xsl:choose>
				<xsl:when test="$isPatientFacingTemplate = false()">
					<xsl:call-template name="displayBPs">
						<xsl:with-param name="measureConcept" select="$measureConcept"/>
						<xsl:with-param name="matchedBPs" select="$matchedBPs"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:otherwise>
					<xsl:call-template name="displayBPsPtFacing">
						<xsl:with-param name="measureConcept" select="$measureConcept"/>
						<xsl:with-param name="matchedBPs" select="$matchedBPs"/>
					</xsl:call-template>
				</xsl:otherwise>
			</xsl:choose>	
		</xsl:if>
	</xsl:template>

	<!-- Build the request structure to send to the matchBPs extension function.
		 This structure should be in the following format:
		 <bp-report>
			<concept-pairs>
	 			<concept key="..systolic bp's concept-cki.." dbp="..diastolic bp's concept-cki.."/>
	 			<concept .../>
		 	</concept-pairs>
	 		<measurements>
	 			<measurement event-id="..id.." event-display="..display.." concept-cki="..concept-cki.." event-code-id="..code.."/>
		 		<measurement .../>
		 	</measurements>
	 	</bp-report>	-->
	<!-- Parameters: -->
	<!--   measureConcept - the measurement-concept node -->
	<xsl:template name="buildMatchBPsRequest">
		<xsl:param name="measureConcept"/>
		
		<bp-report>
			<concept-pairs>
				<xsl:for-each select="$measureConcept/concepts/concept">
					<concept>
						<xsl:attribute name="key">
							<xsl:value-of select="@key"/>
						</xsl:attribute>
						<xsl:attribute name="dbp">
							<xsl:value-of select="@dbp"/>
						</xsl:attribute>
					</concept>
				</xsl:for-each>
			</concept-pairs>
			
			<measurements>
				<!-- Get latest measurements for each BP concept pair -->
				<xsl:for-each select="$measureConcept/concepts/concept">
					
					<xsl:variable name="sSystolicCKI" as="xs:string" select="@key"/>
					<xsl:variable name="sDiastolicCKI" as="xs:string" select="@dbp"/>
					
					<!-- Get all the latest BP measurements, measurements that match the systolic and diastolic BP cki's -->
					<xsl:variable name="BPMeasurements">
						<xsl:for-each select="$AllMeasurements/*[cdocfx:isTypeOf(n:event-type, $sSystolicCKI) or cdocfx:isTypeOf(n:event-type, $sDiastolicCKI)]">
							<xsl:sort select="n:event-end-dt-tm" order="descending" />
							<xsl:copy-of select="." />
						</xsl:for-each>
					</xsl:variable>
					
					<!-- Get measurements that match the first measurement event-end-dt-tm for a concept pair, this is required as we only 
						display the latest measurements for a measurement concept pair -->
					<xsl:for-each select="$BPMeasurements/*[n:event-end-dt-tm = $BPMeasurements/*[1]/n:event-end-dt-tm]">
						<measurement>
							<xsl:attribute name="event-id">
								<xsl:value-of select="@event-id"/>
							</xsl:attribute>
							<xsl:attribute name="event-display">
								<xsl:value-of select="n:event-type/@event-display"/>
							</xsl:attribute>
							<xsl:attribute name="concept-cki">
								<xsl:value-of select="n:event-type/@concept-cki"/>
							</xsl:attribute>
							<xsl:attribute name="event-code-id">
								<xsl:value-of select="n:event-type/@event-code-id"/>
							</xsl:attribute>
						</measurement>
					</xsl:for-each>
				</xsl:for-each>
			</measurements>
		</bp-report>

	</xsl:template>

	<!-- This function parses the reply structure from the matchBPs extension function and 
		displays all of the matched blood pressures.
		NOTE: The reply structure from matchBPs should be in the following format:
		<reply>
			<concept key="..systolic bp's concept-cki..">
				<bp systolic-event-id="..id.." diastolic-event-id="..id.."/>
				<bp .../>
			</concept>
			<concept .../>
		</reply>	-->
	<!-- Parameters: -->
	<!--	measureConcept - the measurement-concept node -->
	<!--	matchedBPs - the reply structure from the matchBPs extension function -->
	<xsl:template name="displayBPs">
		<xsl:param name="measureConcept"/>
		<xsl:param name="matchedBPs"/>
				
		<!-- Get latest measurements for each BP concept pair -->
		<xsl:for-each select="$measureConcept/concepts/concept">
			
			<xsl:variable name="sSystolicCKI" as="xs:string" select="@key"/>
			<xsl:variable name="Method" select="./method"/>
			
			<!-- Get the latest systolic BP measurement, we only expect one measurement here as the $Measurements node-set is 
				 already filtered to keep only one latest masurement for each concept cki in the measure concept map-->
			<xsl:variable name="SystolicBPMeasurement" select="$Measurements/*[cdocfx:isTypeOf(n:event-type, $sSystolicCKI)]"/>	
				
			<!-- In case the format includes Othostatic vitals, do not display supine, sitting and standing with other measurements, display them at the end in a table  -->
			<xsl:if test="($bIncludeOrthoVitals = false()) or ($Method != $sMthdsitting and $Method != $sMthdstanding and $Method != $sMthdsupine)">
				
				<!-- Get the matching diastolic value from the matchedBPs structure -->
				<xsl:variable name="matchingDBPEventid">
					<xsl:call-template name="findMatchingDiastolic">
						<xsl:with-param name="systolicEventId" select="$SystolicBPMeasurement[1]/@event-id"/>
						<xsl:with-param name="matchedBPs" select="$matchedBPs"/>
						<xsl:with-param name="sbpCKI" select="$sSystolicCKI"/>
					</xsl:call-template>
				</xsl:variable>
				
				<xsl:variable name="matchingDBP" select="$Measurements/*[@event-id=$matchingDBPEventid]"/>
				
				<xsl:if test="fn:exists($matchingDBP)">
					<span class="ddgrouper ddremovable">
						<!-- Display -->
						<!-- Declare a separate variable and specify explicit string type for abbreviation as java format function displays error in note otherwise -->
						<xsl:variable name="tempAbbreviation" as="xs:string" select="$measureConcept/abbreviation"/>
						<b><xsl:value-of select="java-string:format($AbbreviationDisplay, $tempAbbreviation)"/><xsl:text disable-output-escaping="yes"><![CDATA[&#160;]]></xsl:text></b>
						<xsl:variable name="empty_string"/>
						
						<!-- Systolic -->
						<xsl:call-template name="tempMeasurementDisplay">
							<xsl:with-param name="abbreviation" select="$empty_string"/>
							<xsl:with-param name="eventId" select="$SystolicBPMeasurement[1]/@event-id"/>
							<xsl:with-param name="value" select="$SystolicBPMeasurement[1]/n:value"/>
							<xsl:with-param name="unit" select="$empty_string"/>
							<xsl:with-param name="method" select="$empty_string"/>
							<xsl:with-param name="removable" select="fn:false()"/>
							<xsl:with-param name="appendSpace" select="fn:false()"/>
						</xsl:call-template>

						<xsl:text>/</xsl:text>

						<!-- Diastolic -->
						<xsl:call-template name="tempMeasurementDisplay">
							<xsl:with-param name="abbreviation" select="$empty_string"/>
							<xsl:with-param name="eventId" select="$matchingDBP[1]/@event-id"/>
							<xsl:with-param name="value" select="$matchingDBP[1]/n:value"/>
							<xsl:with-param name="unit" select="$empty_string"/>
							<xsl:with-param name="method" select="$empty_string"/>
							<xsl:with-param name="removable" select="fn:false()"/>
							<xsl:with-param name="appendSpace" select="fn:false()"/>
						</xsl:call-template>

						<!-- method -->
						<xsl:call-template name="tempMethod"><xsl:with-param name="method" select="$Method"/></xsl:call-template>
						<xsl:text disable-output-escaping="yes"><![CDATA[&#160;]]></xsl:text>
						<xsl:text disable-output-escaping="yes"> </xsl:text>
					</span>
				</xsl:if>
			</xsl:if>
		</xsl:for-each>
	</xsl:template>

	<!-- This template is used to display patient facing BP's. 
	This function parses the reply structure from the matchBPs extension function and 
	displays all of the matched blood pressures.
	NOTE: The reply structure from matchBPs should be in the following format:
	<reply>
		<concept key="..systolic bp's concept-cki..">
			<bp systolic-event-id="..id.." diastolic-event-id="..id.."/>
			<bp .../>
		</concept>
		<concept .../>
	</reply>	-->
	<!-- Parameters: -->
	<!--	measureConcept - the measurement-concept node -->
	<!--	matchedBPs - the reply structure from the matchBPs extension function -->
	<xsl:template name="displayBPsPtFacing">
		<xsl:param name="measureConcept"/>
		<xsl:param name="matchedBPs"/>
				
		<!-- Get latest measurements for each BP concept pair -->
		<xsl:for-each select="$measureConcept/concepts/concept">
			
			<xsl:variable name="sSystolicCKI" as="xs:string" select="@key"/>
			<xsl:variable name="Method" select="./method"/>
			
			<!-- Get the latest systolic BP measurement, we only expect one measurement here as the $Measurements node-set is 
				 already filtered to keep only one latest masurement for each concept cki in the measure concept map-->
			<xsl:variable name="SystolicBPMeasurement" select="$Measurements/*[cdocfx:isTypeOf(n:event-type, $sSystolicCKI)]"/>	
				
			<!-- In case the format includes Othostatic vitals, do not display supine, sitting and standing with other measurements, display them at the end in a table  -->
			<xsl:if test="($bIncludeOrthoVitals = false()) or ($Method != $sMthdsitting and $Method != $sMthdstanding and $Method != $sMthdsupine)">
				
				<!-- Get the matching diastolic value from the matchedBPs structure -->
				<xsl:variable name="matchingDBPEventid">
					<xsl:call-template name="findMatchingDiastolic">
						<xsl:with-param name="systolicEventId" select="$SystolicBPMeasurement[1]/@event-id"/>
						<xsl:with-param name="matchedBPs" select="$matchedBPs"/>
						<xsl:with-param name="sbpCKI" select="$sSystolicCKI"/>
					</xsl:call-template>
				</xsl:variable>
				
				<xsl:variable name="matchingDBP" select="$Measurements/*[@event-id=$matchingDBPEventid]"/>
				
				<xsl:if test="fn:exists($matchingDBP)">
					<div style="padding-top: 5px; display: block;" class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">
						<!-- Display -->
						<!-- Declare a separate variable and specify explicit string type for abbreviation as java format function displays error in note otherwise -->
						<xsl:variable name="tempAbbreviation" as="xs:string" select="$measureConcept/abbreviation"/>
						<b>
							<xsl:value-of select="java-string:format($AbbreviationDisplay, $tempAbbreviation)"/>
							<xsl:text disable-output-escaping="yes"><![CDATA[&#160;]]></xsl:text>
						</b>
						<br/>
						<xsl:variable name="empty_string"/>
						
						<!-- Systolic -->
						<xsl:call-template name="tempMeasurementDisplayPtFacing">
							<xsl:with-param name="abbreviation" select="$empty_string"/>
							<xsl:with-param name="eventId" select="$SystolicBPMeasurement[1]/@event-id"/>
							<xsl:with-param name="value" select="$SystolicBPMeasurement[1]/n:value"/>
							<xsl:with-param name="unit" select="$empty_string"/>
							<xsl:with-param name="method" select="$empty_string"/>
							<xsl:with-param name="appendSpace" select="fn:false()"/>
						</xsl:call-template>

						<xsl:text disable-output-escaping="yes"><![CDATA[&#47;]]></xsl:text>

						<!-- Diastolic -->
						<xsl:call-template name="tempMeasurementDisplayPtFacing">
							<xsl:with-param name="abbreviation" select="$empty_string"/>
							<xsl:with-param name="eventId" select="$matchingDBP[1]/@event-id"/>
							<xsl:with-param name="value" select="$matchingDBP[1]/n:value"/>
							<xsl:with-param name="unit" select="$empty_string"/>
							<xsl:with-param name="method" select="$empty_string"/>
							<xsl:with-param name="appendSpace" select="fn:false()"/>
						</xsl:call-template>

						<!-- method -->
						<xsl:call-template name="tempMethod"><xsl:with-param name="method" select="$Method"/></xsl:call-template>
						<xsl:text disable-output-escaping="yes"><![CDATA[&#160;]]></xsl:text>
						<xsl:text disable-output-escaping="yes"> </xsl:text>
					</div>
				</xsl:if>
			</xsl:if>
		</xsl:for-each>
	</xsl:template>
	<!-- Given a systolic event id, find the matching diastolic event id from the
		reply structure from the matchBPs extension function. -->
	<!-- Parameters: -->
	<!--	systolicEventId - the event id of the systolic measurement -->
	<!--	matchedBPs - the reply structure from the matchBPs extension function -->
	<!--	sbpCKI - the concept-cki of the systolic event code -->
	<xsl:template name="findMatchingDiastolic">
		<xsl:param name="systolicEventId"/>
		<xsl:param name="matchedBPs"/>
		<xsl:param name="sbpCKI"/>

		<xsl:variable name="BPs" select="$matchedBPs/concept[@key=$sbpCKI]/bp"/>
		<xsl:if test="$BPs">
			<xsl:for-each select="$BPs">
				<xsl:if test="@systolic-event-id=$systolicEventId">
					<xsl:value-of select="@diastolic-event-id"/>
				</xsl:if>
			</xsl:for-each>
		</xsl:if>
	</xsl:template>
	
	<!-- Format Orthostatic Blood Pressure measurement. Display only latest measurements for a measurement concept method -->
	<xsl:template name="handleOrthoMeasurements">
		
		<!-- Get all Orthostatic BP measurements-->
		<xsl:variable name="OrthoBPMeasurementsExist" select="$Measurements/*[cdocfx:isTypeOf(n:event-type, $measureConceptBP/concepts/concept/@key) or cdocfx:isTypeOf(n:event-type, $measureConceptBP/concepts/concept/@dbp)]"/>
		
		<xsl:choose>
			<!-- Call extension function and display BP's only if BP measurements exist  -->
			<xsl:when test="fn:exists($OrthoBPMeasurementsExist)">
			
				<!-- Create temp variable with structure that needs to be passed to Java extension function -->
				<xsl:variable name="javaRequest">
					<xsl:call-template name="buildMatchBPsRequest">
						<xsl:with-param name="measureConcept" select="$measureConceptBP"/>
					</xsl:call-template>
				</xsl:variable>
				
				<!-- Call java extension function to get matched blood pressures grouped by concept -->
				<xsl:variable name="matchedBPs" as="node()" select="doc:matchBPs($javaRequest)" />
				
				<!-- Display the matched orthostatic blood pressures and heart rates -->
				<xsl:call-template name="displayOrthoMeasurements">
					<xsl:with-param name="matchedBPs" select="$matchedBPs"/>
				</xsl:call-template>
				
			</xsl:when>
			
			<xsl:otherwise>
				<!-- Display the orthostatic heart rate measurements -->
				<xsl:call-template name="displayOrthoMeasurements">
				</xsl:call-template>
			</xsl:otherwise>
			
		</xsl:choose>
	</xsl:template>
	
	<!-- This function parses the reply structure from the matchBPs extension function and 
		displays all of the matched othostatic blood pressures.
		NOTE: The reply structure from matchBPs should be in the following format:
		<reply>
			<concept key="..systolic bp's concept-cki..">
				<bp systolic-event-id="..id.." diastolic-event-id="..id.."/>
				<bp .../>
			</concept>
			<concept .../>
		</reply>	-->
	<!-- Parameters: -->
	<!--	matchedBPs - the reply structure from the matchBPs extension function -->
	<xsl:template name="displayOrthoMeasurements">
		<xsl:param name="matchedBPs"/>
		
		<!-- Get all Orthostatic BP and HR measurements-->
		<xsl:variable name="OrthoBPMeasurementsExist" select="$Measurements/*[cdocfx:isTypeOf(n:event-type, $measureConceptBP/concepts/concept/@key) or cdocfx:isTypeOf(n:event-type, $measureConceptBP/concepts/concept/@dbp)]"/>
		<xsl:variable name="OrthoHRMeasurementsExist" select="$Measurements/*[cdocfx:isTypeOf(n:event-type, $measureConceptHR/concepts/concept/@key)]" />
		
		<!-- Display table only if Ortho BP or HR exist -->
		<xsl:if test="fn:exists($OrthoBPMeasurementsExist) or fn:exists($OrthoHRMeasurementsExist)">
			
			<!-- Display labels -->
			<div dd:btnfloatingstyle="top-right" class="ddgrouper ddremovable">
				<div style="display: block;">
					<span style="width:10%; min-width:5%; display: inline-block;">
						<xsl:text disable-output-escaping="yes"><![CDATA[&#160;]]></xsl:text>
					</span>
					<xsl:if test="fn:exists($OrthoBPMeasurementsExist)">
						<span style="width:20%; min-width:10%; display: inline-block;">
							<b><xsl:value-of select="java-string:format($OrthoAbbreviationDisplay, $sAbbrvOrthoBloodPressure)"/></b>
						</span>
					</xsl:if>
					<xsl:if test="fn:exists($OrthoHRMeasurementsExist)">
						<span style="width:20%; min-width:10%; display: inline-block;">
							<b><xsl:value-of select="java-string:format($OrthoAbbreviationDisplay, $sAbbrvOrthoHeartRate)"/></b>
						</span>
					</xsl:if>
				</div>
				
				<!-- Display Supine -->
				<xsl:variable name="sBPSupineCKI" select="'CERNER!AKUJFgEW6OV+moG0CqIGfQ'"/>
				<xsl:variable name="sHRSupineCKI" select="'CERNER!AKUJFgEW6OV+moHMCqIGfQ'"/>
				
				<xsl:call-template name="displaySingleOrthoMeasurementRow">
					<xsl:with-param name="matchedBPs" select="$matchedBPs"/>
					<xsl:with-param name="sBPCKI" select="$sBPSupineCKI"/>
					<xsl:with-param name="sHRCKI" select="$sHRSupineCKI"/>
				</xsl:call-template>
				
				<!-- Display Sitting -->
				<xsl:variable name="sBPSittingCKI" select="'CERNER!AKUJFgEW6OV+moHYCqIGfQ'"/>
				<xsl:variable name="sHRSittingCKI" select="'CERNER!AKUJFgEW6OV+moHwCqIGfQ'"/>
				
				<xsl:call-template name="displaySingleOrthoMeasurementRow">
					<xsl:with-param name="matchedBPs" select="$matchedBPs"/>
					<xsl:with-param name="sBPCKI" select="$sBPSittingCKI"/>
					<xsl:with-param name="sHRCKI" select="$sHRSittingCKI"/>
				</xsl:call-template>
				
				<!-- Display Standing -->
				<xsl:variable name="sBPStandingCKI" select="'CERNER!AKUJFgEW6OV+moH8CqIGfQ'"/>
				<xsl:variable name="sHRStandingCKI" select="'CERNER!AKUJFgEW6OV+moIUCqIGfQ'"/>
				
				<xsl:call-template name="displaySingleOrthoMeasurementRow">
					<xsl:with-param name="matchedBPs" select="$matchedBPs"/>
					<xsl:with-param name="sBPCKI" select="$sBPStandingCKI"/>
					<xsl:with-param name="sHRCKI" select="$sHRStandingCKI"/>
				</xsl:call-template>

			</div>
		</xsl:if>
	</xsl:template>
	
	<xsl:template name="displaySingleOrthoMeasurementRow">
		<xsl:param name="matchedBPs"/>
		<xsl:param name="sBPCKI"/>
		<xsl:param name="sHRCKI"/>
		
		<!-- Get all Orthostatic BP and HR measurements, these variables are required later on to decide whether or not to display table columns -->
		<xsl:variable name="OrthoBPMeasurementsExist" select="$Measurements/*[cdocfx:isTypeOf(n:event-type, $measureConceptBP/concepts/concept/@key) or cdocfx:isTypeOf(n:event-type, $measureConceptBP/concepts/concept/@dbp)]"/>
		<xsl:variable name="OrthoHRMeasurementsExist" select="$Measurements/*[cdocfx:isTypeOf(n:event-type, $measureConceptHR/concepts/concept/@key)]" />
		
		<xsl:variable name="conceptMap" select="$measureConceptBP/concepts/concept[@key=$sBPCKI]"/>
		
		<!-- Display BP and HR values with the event-end-dt-tm -->
		<xsl:variable name="SystolicBPMeasurement" select="$Measurements/*[cdocfx:isTypeOf(n:event-type, $sBPCKI)]"/>				
		<xsl:variable name="HRMeasurement" select="$Measurements/*[cdocfx:isTypeOf(n:event-type, $sHRCKI)]"/>
		
		<xsl:if test="fn:exists($SystolicBPMeasurement) or  fn:exists($HRMeasurement)">
			
			<div style="display: block;">
				<!-- Method -->
				<span style="width:10%; min-width:5%; display: inline-block;"><b><xsl:value-of select="$conceptMap[1]/method"/></b></span>
				<xsl:variable name="empty_string"/>
				
				<xsl:if test="fn:exists($OrthoBPMeasurementsExist)">
					<span style="width:20%; min-width:10%; display: inline-block;">
						<!-- Blood Pressure -->
						<xsl:if test="fn:exists($SystolicBPMeasurement)">	
							
							<!-- Get the matching diastolic value from the matchedBPs structure -->
							<xsl:variable name="matchingDBPEventid">
								<xsl:call-template name="findMatchingDiastolic">
									<xsl:with-param name="systolicEventId" select="$SystolicBPMeasurement[1]/@event-id"/>
									<xsl:with-param name="matchedBPs" select="$matchedBPs"/>
									<xsl:with-param name="sbpCKI" select="$sBPCKI"/>
								</xsl:call-template>
							</xsl:variable>
							
							<xsl:variable name="matchingDBP" select="$Measurements/*[@event-id=$matchingDBPEventid]"/>
							
							<xsl:if test="fn:exists($matchingDBP)">	
								<span class="ddgrouper ddremovable">
									
									<!-- Systolic -->
									<xsl:call-template name="tempMeasurementDisplay">
										<xsl:with-param name="abbreviation" select="$empty_string"/>
										<xsl:with-param name="eventId" select="$SystolicBPMeasurement[1]/@event-id"/>
										<xsl:with-param name="value" select="$SystolicBPMeasurement[1]/n:value"/>
										<xsl:with-param name="unit" select="$empty_string"/>
										<xsl:with-param name="method" select="$empty_string"/>
										<xsl:with-param name="removable" select="fn:false()"/>
										<xsl:with-param name="appendSpace" select="fn:false()"/>
									</xsl:call-template>
									
									<xsl:text>/</xsl:text>
									
									<!-- Diastolic -->
									<xsl:call-template name="tempMeasurementDisplay">
										<xsl:with-param name="abbreviation" select="$empty_string"/>
										<xsl:with-param name="eventId" select="$matchingDBP[1]/@event-id"/>
										<xsl:with-param name="value" select="$matchingDBP[1]/n:value"/>
										<xsl:with-param name="unit" select="$empty_string"/>
										<xsl:with-param name="method" select="$empty_string"/>
										<xsl:with-param name="removable" select="fn:false()"/>
										<xsl:with-param name="appendSpace" select="fn:false()"/>
									</xsl:call-template>
									
									<xsl:text disable-output-escaping="yes"><![CDATA[&#160;]]></xsl:text>
									<xsl:text disable-output-escaping="yes"> </xsl:text>
									
									<xsl:variable name="EventEndDtTm" as="xs:dateTime" select="$SystolicBPMeasurement[1]/n:event-end-dt-tm"/>
									<xsl:variable name="Timezone" select="$SystolicBPMeasurement[1]/n:event-end-dt-tm/@time-zone"/>
									<xsl:value-of select="xr-date-formatter:formatDate($EventEndDtTm, $DATE_SEQUENCE, $Timezone, $current-locale)"/>		
								</span>			
							</xsl:if>
						</xsl:if>
					</span>
				</xsl:if>
				<!-- Heart Rate -->
				<xsl:if test="fn:exists($OrthoHRMeasurementsExist)">
					<span style="width:20%; min-width:10%; display: inline-block;">
						<xsl:if test="fn:exists($HRMeasurement)">
							<span class="ddgrouper ddremovable">
								<xsl:call-template name="tempMeasurementDisplay">
									<xsl:with-param name="abbreviation" select="$empty_string"/>
									<xsl:with-param name="eventId" select="$HRMeasurement[1]/@event-id"/>
									<xsl:with-param name="value" select="$HRMeasurement[1]/n:value"/>
									<xsl:with-param name="unit" select="$empty_string"/>
									<xsl:with-param name="method" select="$empty_string"/>
									<xsl:with-param name="removable" select="fn:false()"/>
									<xsl:with-param name="appendSpace" select="fn:false()"/>
								</xsl:call-template>
								
								<xsl:text disable-output-escaping="yes"><![CDATA[&#160;]]></xsl:text>
								<xsl:text disable-output-escaping="yes"> </xsl:text>
								
								<xsl:variable name="EventEndDtTm" as="xs:dateTime" select="$HRMeasurement[1]/n:event-end-dt-tm"/>
								<xsl:variable name="Timezone" select="$HRMeasurement[1]/n:event-end-dt-tm/@time-zone"/>
								<xsl:value-of select="xr-date-formatter:formatDate($EventEndDtTm, $DATE_SEQUENCE, $Timezone, $current-locale)"/>
							</span>
						</xsl:if>
					</span>
				</xsl:if>
			</div>
		</xsl:if>
	</xsl:template>
	
	<xsl:variable name="measureConceptBP" select="$vitalMeasurement/measurement-concept[@type='OrthoBloodPressure']"/>
	<xsl:variable name="measureConceptHR" select="$vitalMeasurement/measurement-concept[@type='OrthoHeartRate']"/>
	
	<!-- AllMeasurements node set includes all measurements including duplicates nodes from all the task-completion nodes
		 Duplicate measurements are defined as those measurements across multiple task-completion nodes with the same concept-cki -->
	<xsl:variable name="AllMeasurements">
		<xsl:for-each select="n:report/n:clinical-data/n:patient-care-measurement-data/n:task-completion/n:measurement">
			<xsl:sort select="n:event-end-dt-tm" order="descending" />
			<xsl:copy-of select="."/>
		</xsl:for-each>
	</xsl:variable>
	
	<!-- Measurements node set eliminates the duplicate measurements. Measurement with the most recent date is selected and 
		 other duplicate nodes with same concept-cki are eliminated.
		 Duplicate measurements are defined as those measurements across multiple task-completion nodes with the same concept-cki -->
	<xsl:variable name="Measurements">
		<xsl:for-each select="$AllMeasurements/*[not(n:event-type/@concept-cki = preceding::n:measurement/n:event-type/@concept-cki)]">
			<xsl:sort select="n:event-end-dt-tm" order="descending" />
			<xsl:copy-of select="."/>
		</xsl:for-each>
	</xsl:variable>

<!--Get all the first line vitals values either charted or non-charted-->	
	<xsl:variable name = "vitalsList">
		<xsl:for-each select="$vitalMeasurement/measurement-concept">
			<xsl:variable name="cki" select="concepts/concept/@key"/>
			<xsl:variable name="measure" select="."/>
				<xsl:call-template name="getFirstLineChartedVitals">
					<xsl:with-param name="measureConcept" select="$measure"/>
				</xsl:call-template>
		</xsl:for-each>
	</xsl:variable>

<!--template to get the result values based on vital types.
If any of the first line vital is charted then returns a value "1" else "0"-->	
	<xsl:template name = "getFirstLineChartedVitals">
		<xsl:param name = "measureConcept"/>
			<xsl:for-each select = "$AllMeasurements/*[cdocfx:isTypeOf(n:event-type, $measureConcept/concepts/concept/@key)]">
				<xsl:choose>
					<xsl:when test = "$measureConcept/@type ='Temperature' or
						$measureConcept/@type ='HeartRate' or
						$measureConcept/@type='RespiratoryRate' or
						$measureConcept/@type='BloodPressure' or
						$measureConcept/@type='SpO2'">
							<xsl:value-of select ="1"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select ="0"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:for-each>
	</xsl:template>
	
<!--Function which returns true if any first line vital is charted else false-->
	<xsl:function name= "cdocfx:isFirstLineVitalCharted" as="xs:boolean">
		<xsl:param name = "vitalsList"/>
			<xsl:choose>
				<xsl:when test = "contains($vitalsList, '1')">
					<xsl:value-of select = "fn:true()"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select = "fn:false()"/>
				</xsl:otherwise>
			</xsl:choose>
	</xsl:function>


	<!-- Main template -->
	<xsl:template match="/">
		
		<!-- storing the birth date of the patient in the variable birthDate -->
		<xsl:variable name="birthDate" as="xs:string">
			<xsl:choose>
				<xsl:when test="n:report/n:demographics/n:patient-info/n:birth-dt-tm /n:date">
					<xsl:value-of select="n:report/n:demographics/n:patient-info/n:birth-dt-tm /n:date"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="''"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		
		<xsl:for-each select="$vitalMeasurement/measurement-concept">
			<xsl:variable name="cki" select="concepts/concept/@key"/>
			<xsl:variable name="measureConcept" select="."/>
			
			<!-- Format measurement -->
			<xsl:choose>
				<xsl:when test="$measureConcept/@type='BloodPressure' or $measureConcept/@type='OrthoBloodPressure'">									
					<xsl:call-template name="handleBPs">
						<xsl:with-param name="measureConcept" select="$measureConcept"/>
					</xsl:call-template>				
				</xsl:when>
				<!-- Ignore OrthoHeartRate as they are displayed with only OrthoStaticVitals -->
				<xsl:when test="$measureConcept/@type='OrthoHeartRate'">										
				</xsl:when>
				<xsl:otherwise>
					<xsl:call-template name="handleMeasurements">
						<xsl:with-param name="measureConcept" select="$measureConcept"/>
						<xsl:with-param name="birthDate" select="$birthDate"/>
					</xsl:call-template>		
				</xsl:otherwise>
			</xsl:choose>
			
			<xsl:if test="$isPatientFacingTemplate = false()">
				<!-- Get maxmum and minimum temperature -->
				<xsl:if test="$bIncludeEDVitals = false()">
					<xsl:if test="$measureConcept/@type='Temperature'">
						<xsl:call-template name="handleMinMaxTemperature">
							<xsl:with-param name="measureConcept" select="$measureConcept"/>
						</xsl:call-template>		
					</xsl:if>
				</xsl:if>
				
				<!-- Add a line break after SpO2 for ED Vitals-->
				<xsl:if test="$bIncludeEDVitals = true()">
					<xsl:if test="$measureConcept/@type='SpO2' and (cdocfx:isFirstLineVitalCharted($vitalsList)) "><br/></xsl:if>
				</xsl:if>
			</xsl:if>
			
		</xsl:for-each>
		
		<!-- Display Orhtostatic vitals at the end in a table -->
		<xsl:if test="$bIncludeOrthoVitals = true()">
			<xsl:call-template name="handleOrthoMeasurements"/>
		</xsl:if>
	</xsl:template>
	
</xsl:stylesheet>
