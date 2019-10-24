<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="1.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema">
	<!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/es/dateformat_es.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="./dateformat_es.xslt" /> -->
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param name="current-locale" as="xs:string" select="'es'"/>
	
	<!-- Strings defined for VitalsMeasurementCommon.xslt, String values defined here override the default values defined in VitalsMeasurementCommon.xslt -->
	<xsl:variable name="AbbreviationDisplay" as="xs:string">
		<xsl:value-of select="'%s'"/>
	</xsl:variable>
	<xsl:variable name="MethodDisplay" as="xs:string">
		<xsl:value-of select="'(%s)'"/>
	</xsl:variable>
	<!-- Degree Celsius unicode representation, Link to html codes: http://www.w3.org/TR/WD-html40-970708/sgml/entities.html -->
	<xsl:variable name="DegreeCelsius"><![CDATA[&#176;]]>C</xsl:variable>
	<!-- Degree Fahrenheit unicode representation, Link to html codes: http://www.w3.org/TR/WD-html40-970708/sgml/entities.html -->
	<xsl:variable name="DegreeFahrenheit"><![CDATA[&#176;]]>F</xsl:variable>
	
	<!--For Visit Summary and Patient Facing templates we will display vital signs differently. 
		For Patient Facing templates the value of isPatientFacingTemplate boolean will be true, else false.-->
	<xsl:variable name="isPatientFacingTemplate" as="xs:boolean" select="true()"/>

	<!-- Strings defined for VitalsMeasurementED.xslt, String values defined here override the default values defined in VitalsMeasurementED.xslt -->
	<!-- String constants for Abbreviations-->
	<xsl:variable name="sAbbrvTemperature" as="xs:string"><xsl:value-of select="'Temperatura'"/></xsl:variable>
	<xsl:variable name="sAbbrvHeartRate" as="xs:string"><xsl:value-of select="'Frecuencia cardiaca'"/></xsl:variable>
	<xsl:variable name="sAbbrvRespiratoryRate" as="xs:string"><xsl:value-of select="'Frecuencia respiratoria'"/></xsl:variable>
	<xsl:variable name="sAbbrvBloodPressure" as="xs:string"><xsl:value-of select="'Presi&#243;n arterial'"/></xsl:variable>
	<xsl:variable name="sAbbrvOrthoBloodPressure" as="xs:string"><xsl:value-of select="'Tensi&#243;n arterial ortost&#225;tica'"/></xsl:variable>
	<xsl:variable name="sAbbrvHeight" as="xs:string"><xsl:value-of select="'Estatura'"/></xsl:variable>
	<xsl:variable name="sAbbrvWeight" as="xs:string"><xsl:value-of select="'Peso'"/></xsl:variable>
	<xsl:variable name="sAbbrvBMI" as="xs:string"><xsl:value-of select="'IMC'"/></xsl:variable>
	<xsl:variable name="sAbbrvICP" as="xs:string"><xsl:value-of select="'PIC'"/></xsl:variable>
	<xsl:variable name="sAbbrvGCS" as="xs:string"><xsl:value-of select="'Puntuaci&#243;n en Escala de coma de Glasgow'"/></xsl:variable>
	<xsl:variable name="sAbbrvNIH" as="xs:string"><xsl:value-of select="'Puntuaci&#243;n en Escala de apoplej&#237;a NIH'"/></xsl:variable>
	<xsl:variable name="sAbbrvPVR" as="xs:string"><xsl:value-of select="'Resistencia vascular pulmonar'"/></xsl:variable>
	<xsl:variable name="sAbbrvOrthoHeartRate" as="xs:string"><xsl:value-of select="'Frecuencia card&#237;aca ortost&#225;tica'"/></xsl:variable>

	<!-- String constants for Methods-->
	<xsl:variable name="sMthdEmpty" as="xs:string"><xsl:value-of select="''"/></xsl:variable>
	<xsl:variable name="sMthdAxillary" as="xs:string"><xsl:value-of select="'Axilar'"/></xsl:variable>
	<xsl:variable name="sMthdBladder" as="xs:string"><xsl:value-of select="'Vesical'"/></xsl:variable>
	<xsl:variable name="sMthdBrain" as="xs:string"><xsl:value-of select="'Cerebral'"/></xsl:variable>
	<xsl:variable name="sMthdEsophageal" as="xs:string"><xsl:value-of select="'Esof&#225;gico'"/></xsl:variable>
	<xsl:variable name="sMthdIntravascular" as="xs:string"><xsl:value-of select="'Intravascular'"/></xsl:variable>
	<xsl:variable name="sMthdOral" as="xs:string"><xsl:value-of select="'Oral'"/></xsl:variable>
	<xsl:variable name="sMthdRectal" as="xs:string"><xsl:value-of select="'Rectal'"/></xsl:variable>
	<xsl:variable name="sMthdSkin" as="xs:string"><xsl:value-of select="'Cut&#225;neo'"/></xsl:variable>
	<xsl:variable name="sMthdTemporalArtery" as="xs:string"><xsl:value-of select="'Arteria temporal'"/></xsl:variable>
	<xsl:variable name="sMthdTympanic" as="xs:string"><xsl:value-of select="'Timp&#225;nico'"/></xsl:variable>
	<xsl:variable name="sMthdCore" as="xs:string"><xsl:value-of select="'Nuclear'"/></xsl:variable>
	<xsl:variable name="sMthdApical" as="xs:string"><xsl:value-of select="'Apical'"/></xsl:variable>
	<xsl:variable name="sMthdMonitored" as="xs:string"><xsl:value-of select="'Monitorizado'"/></xsl:variable>
	<xsl:variable name="sMthdApnea" as="xs:string"><xsl:value-of select="'Apnea'"/></xsl:variable>
	<xsl:variable name="sMthdSpontaneous" as="xs:string"><xsl:value-of select="'Espont&#225;neo'"/></xsl:variable>
	<xsl:variable name="sMthdtotal" as="xs:string"><xsl:value-of select="'Total'"/></xsl:variable>
	<xsl:variable name="sMthdactivity" as="xs:string"><xsl:value-of select="'Actividad'"/></xsl:variable>
	<xsl:variable name="sMthdassisted" as="xs:string"><xsl:value-of select="'Asistida'"/></xsl:variable>
	<xsl:variable name="sMthdcuff" as="xs:string"><xsl:value-of select="'Esfigmoman&#243;metro'"/></xsl:variable>
	<xsl:variable name="sMthdline" as="xs:string"><xsl:value-of select="'L&#237;nea'"/></xsl:variable>
	<xsl:variable name="sMthdsitting" as="xs:string"><xsl:value-of select="'Sedestaci&#243;n'"/></xsl:variable>
	<xsl:variable name="sMthdstanding" as="xs:string"><xsl:value-of select="'Bipedestaci&#243;n'"/></xsl:variable>
	<xsl:variable name="sMthdsupine" as="xs:string"><xsl:value-of select="'Supino'"/></xsl:variable>
	<xsl:variable name="sMthdPeripheral" as="xs:string" select="'Periférico'"/>
	<xsl:variable name="birth" as="xs:string" select="'(al nacer)'"/>

</xsl:stylesheet>
