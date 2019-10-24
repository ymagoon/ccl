<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="1.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema">
	<!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/fr/dateformat_fr.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="./dateformat_fr.xslt" /> -->
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param name="current-locale" as="xs:string" select="'fr'"/>
	
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
	<xsl:variable name="sAbbrvTemperature" as="xs:string"><xsl:value-of select="'Temp&#233;rature'"/></xsl:variable>
	<xsl:variable name="sAbbrvHeartRate" as="xs:string"><xsl:value-of select="'Fr&#233;quence cardiaque'"/></xsl:variable>
	<xsl:variable name="sAbbrvRespiratoryRate" as="xs:string"><xsl:value-of select="'Fr&#233;quence respiratoire'"/></xsl:variable>
	<xsl:variable name="sAbbrvBloodPressure" as="xs:string"><xsl:value-of select="'Pression art&#233;rielle'"/></xsl:variable>
	<xsl:variable name="sAbbrvOrthoBloodPressure" as="xs:string"><xsl:value-of select="'Pression art&#233;rielle orthostatique'"/></xsl:variable>
	<xsl:variable name="sAbbrvSpO2" as="xs:string"><xsl:value-of select="'SpO2'"/></xsl:variable>
	<xsl:variable name="sAbbrvHeight" as="xs:string"><xsl:value-of select="'Taille'"/></xsl:variable>
	<xsl:variable name="sAbbrvWeight" as="xs:string"><xsl:value-of select="'Poids'"/></xsl:variable>
	<xsl:variable name="sAbbrvBMI" as="xs:string"><xsl:value-of select="'IMC'"/></xsl:variable>
	<xsl:variable name="sAbbrvICP" as="xs:string"><xsl:value-of select="'PIC'"/></xsl:variable>
	<xsl:variable name="sAbbrvGCS" as="xs:string"><xsl:value-of select="'&#201;chelle de Glasgow'"/></xsl:variable>
	<xsl:variable name="sAbbrvNIH" as="xs:string"><xsl:value-of select="'Score NIHSS'"/></xsl:variable>
	<xsl:variable name="sAbbrvPVR" as="xs:string"><xsl:value-of select="'PVR'"/></xsl:variable>
	<xsl:variable name="sAbbrvOrthoHeartRate" as="xs:string"><xsl:value-of select="'Rythme cardiaque orthostatique'"/></xsl:variable>
	
	<!-- String constants for Methods-->
	<xsl:variable name="sMthdEmpty" as="xs:string"><xsl:value-of select="''"/></xsl:variable>
	<xsl:variable name="sMthdAxillary" as="xs:string"><xsl:value-of select="'Axillaire'"/></xsl:variable>
	<xsl:variable name="sMthdBladder" as="xs:string"><xsl:value-of select="'Vessie'"/></xsl:variable>
	<xsl:variable name="sMthdBrain" as="xs:string"><xsl:value-of select="'Cerveau'"/></xsl:variable>
	<xsl:variable name="sMthdEsophageal" as="xs:string"><xsl:value-of select="'&#338;sophagienne'"/></xsl:variable>
	<xsl:variable name="sMthdIntravascular" as="xs:string"><xsl:value-of select="'Intravasculaire'"/></xsl:variable>
	<xsl:variable name="sMthdOral" as="xs:string"><xsl:value-of select="'Orale'"/></xsl:variable>
	<xsl:variable name="sMthdRectal" as="xs:string"><xsl:value-of select="'Rectale'"/></xsl:variable>
	<xsl:variable name="sMthdSkin" as="xs:string"><xsl:value-of select="'Cutan&#233;e'"/></xsl:variable>
	<xsl:variable name="sMthdTemporalArtery" as="xs:string"><xsl:value-of select="'Art&#232;re temporale'"/></xsl:variable>
	<xsl:variable name="sMthdTympanic" as="xs:string"><xsl:value-of select="'Tympanique'"/></xsl:variable>
	<xsl:variable name="sMthdCore" as="xs:string"><xsl:value-of select="'Corporelle'"/></xsl:variable>
	<xsl:variable name="sMthdApical" as="xs:string"><xsl:value-of select="'Apical'"/></xsl:variable>
	<xsl:variable name="sMthdMonitored" as="xs:string"><xsl:value-of select="'Surveill&#233;'"/></xsl:variable>
	<xsl:variable name="sMthdApnea" as="xs:string"><xsl:value-of select="'Apn&#233;e'"/></xsl:variable>
	<xsl:variable name="sMthdSpontaneous" as="xs:string"><xsl:value-of select="'Spontan&#233;'"/></xsl:variable>
	<xsl:variable name="sMthdtotal" as="xs:string"><xsl:value-of select="'Total'"/></xsl:variable>
	<xsl:variable name="sMthdactivity" as="xs:string"><xsl:value-of select="'Activit&#233;'"/></xsl:variable>
	<xsl:variable name="sMthdassisted" as="xs:string"><xsl:value-of select="'Assist&#233;'"/></xsl:variable>
	<xsl:variable name="sMthdcuff" as="xs:string"><xsl:value-of select="'Brassard'"/></xsl:variable>
	<xsl:variable name="sMthdline" as="xs:string"><xsl:value-of select="'Ligne'"/></xsl:variable>
	<xsl:variable name="sMthdsitting" as="xs:string"><xsl:value-of select="'Assis'"/></xsl:variable>
	<xsl:variable name="sMthdstanding" as="xs:string"><xsl:value-of select="'Debout'"/></xsl:variable>
	<xsl:variable name="sMthdsupine" as="xs:string"><xsl:value-of select="'Couch&#233;'"/></xsl:variable>
	<xsl:variable name="sMthdPeripheral" as="xs:string" select="'Périphérique'"/>
	<xsl:variable name="birth" as="xs:string" select="'(Naissance)'"/>
	
</xsl:stylesheet>
