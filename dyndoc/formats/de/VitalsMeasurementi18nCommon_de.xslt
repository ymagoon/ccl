<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="1.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema">
	
	<!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/de/dateformat_de.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="./dateformat_de.xslt" /> -->
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param name="current-locale" as="xs:string" select="'de'"/>
	
	<!-- Strings defined for VitalsMeasurementCommon.xslt, String values defined here override the default values defined in VitalsMeasurementCommon.xslt -->
	<xsl:variable name="maxTemp" as="xs:string">
		<xsl:value-of select="'TMAX'"/>
	</xsl:variable>
	<xsl:variable name="minTemp" as="xs:string">
		<xsl:value-of select="'TMIN'"/>
	</xsl:variable>
	<xsl:variable name="AbbreviationDisplay" as="xs:string">
		<xsl:value-of select="'%s:'"/>
	</xsl:variable>
	<xsl:variable name="MethodDisplay" as="xs:string">
		<xsl:value-of select="'(%s)'"/>
	</xsl:variable>
	<!-- Degree Celsius unicode representation, Link to html codes: http://www.w3.org/TR/WD-html40-970708/sgml/entities.html -->
	<xsl:variable name="DegreeCelsius">
		<![CDATA[&#176;]]>C
	</xsl:variable>
	<!-- Degree Fahrenheit unicode representation, Link to html codes: http://www.w3.org/TR/WD-html40-970708/sgml/entities.html -->
	<xsl:variable name="DegreeFahrenheit">
		<![CDATA[&#176;]]>F
	</xsl:variable>
	
	<!--For Visit Summary and Patient Facing templates we will display vital signs differently.
	For Patient Facing templates the value of isPatientFacingTemplate boolean will be true, else false.-->
	<xsl:variable name="isPatientFacingTemplate" as="xs:boolean" select="false()"/>
	
	<!-- Strings defined for VitalsMeasurementED.xslt, String values defined here override the default values defined in VitalsMeasurementED.xslt -->
	<!-- String constants for Abbreviations-->
	<xsl:variable name="sAbbrvTemperature" as="xs:string"><xsl:value-of select="'T'"/></xsl:variable>
	<xsl:variable name="sAbbrvHeartRate" as="xs:string"><xsl:value-of select="'HF'"/></xsl:variable>
	<xsl:variable name="sAbbrvRespiratoryRate" as="xs:string"><xsl:value-of select="'AF'"/></xsl:variable>
	<xsl:variable name="sAbbrvBloodPressure" as="xs:string"><xsl:value-of select="'BD'"/></xsl:variable>
	<xsl:variable name="sAbbrvOrthoBloodPressure" as="xs:string"><xsl:value-of select="'Orthostatischer BD'"/></xsl:variable>
	<xsl:variable name="sAbbrvSpO2" as="xs:string"><xsl:value-of select="'SpO2'"/></xsl:variable>
	<xsl:variable name="sAbbrvHeight" as="xs:string"><xsl:value-of select="'Gr&#246;&#223;e'"/></xsl:variable>
	<xsl:variable name="sAbbrvWeight" as="xs:string"><xsl:value-of select="'Gewicht'"/></xsl:variable>
	<xsl:variable name="sAbbrvBMI" as="xs:string"><xsl:value-of select="'BMI'"/></xsl:variable>
	<xsl:variable name="sAbbrvICP" as="xs:string"><xsl:value-of select="'ICP'"/></xsl:variable>
	<xsl:variable name="sAbbrvGCS" as="xs:string"><xsl:value-of select="'GCS-Score'"/></xsl:variable>
	<xsl:variable name="sAbbrvNIH" as="xs:string"><xsl:value-of select="'NIHSS-Score'"/></xsl:variable>
	<xsl:variable name="sAbbrvPVR" as="xs:string"><xsl:value-of select="'PVR'"/></xsl:variable>
	<xsl:variable name="sAbbrvOrthoHeartRate" as="xs:string"><xsl:value-of select="'Orthostatische HF'"/></xsl:variable>
	
	<!-- String constants for Methods-->
	<xsl:variable name="sMthdEmpty" as="xs:string"><xsl:value-of select="''"/></xsl:variable>
	<xsl:variable name="sMthdAxillary" as="xs:string"><xsl:value-of select="'Axillar'"/></xsl:variable>
	<xsl:variable name="sMthdBladder" as="xs:string"><xsl:value-of select="'Blase'"/></xsl:variable>
	<xsl:variable name="sMthdBrain" as="xs:string"><xsl:value-of select="'Gehirn'"/></xsl:variable>
	<xsl:variable name="sMthdEsophageal" as="xs:string"><xsl:value-of select="'&#214;sophagal'"/></xsl:variable>
	<xsl:variable name="sMthdIntravascular" as="xs:string"><xsl:value-of select="'Intravaskul&#228;r'"/></xsl:variable>
	<xsl:variable name="sMthdOral" as="xs:string"><xsl:value-of select="'Oral'"/></xsl:variable>
	<xsl:variable name="sMthdRectal" as="xs:string"><xsl:value-of select="'Rektal'"/></xsl:variable>
	<xsl:variable name="sMthdSkin" as="xs:string"><xsl:value-of select="'Haut'"/></xsl:variable>
	<xsl:variable name="sMthdTemporalArtery" as="xs:string"><xsl:value-of select="'Schl&#228;fenarterie'"/></xsl:variable>
	<xsl:variable name="sMthdTympanic" as="xs:string"><xsl:value-of select="'Tympanisch'"/></xsl:variable>
	<xsl:variable name="sMthdCore" as="xs:string"><xsl:value-of select="'Kern'"/></xsl:variable>
	<xsl:variable name="sMthdApical" as="xs:string"><xsl:value-of select="'Apikal'"/></xsl:variable>
	<xsl:variable name="sMthdMonitored" as="xs:string"><xsl:value-of select="'&#220;berwacht'"/></xsl:variable>
	<xsl:variable name="sMthdApnea" as="xs:string"><xsl:value-of select="'Apnoe'"/></xsl:variable>
	<xsl:variable name="sMthdSpontaneous" as="xs:string"><xsl:value-of select="'Spontan'"/></xsl:variable>
	<xsl:variable name="sMthdtotal" as="xs:string"><xsl:value-of select="'Gesamt'"/></xsl:variable>
	<xsl:variable name="sMthdactivity" as="xs:string"><xsl:value-of select="'Aktivit&#228;t'"/></xsl:variable>
	<xsl:variable name="sMthdassisted" as="xs:string"><xsl:value-of select="'Unterst&#252;tzt'"/></xsl:variable>
	<xsl:variable name="sMthdcuff" as="xs:string"><xsl:value-of select="'Manschette'"/></xsl:variable>
	<xsl:variable name="sMthdline" as="xs:string"><xsl:value-of select="'Katheter'"/></xsl:variable>
	<xsl:variable name="sMthdsitting" as="xs:string"><xsl:value-of select="'Sitzend'"/></xsl:variable>
	<xsl:variable name="sMthdstanding" as="xs:string"><xsl:value-of select="'Stehend'"/></xsl:variable>
	<xsl:variable name="sMthdsupine" as="xs:string"><xsl:value-of select="'In R&#252;ckenlage'"/></xsl:variable>
	<xsl:variable name="sMthdPeripheral" as="xs:string" select="'Peripher'"/>
	<xsl:variable name="birth" as="xs:string" select="'(Geburt)'"/>
	
</xsl:stylesheet>
