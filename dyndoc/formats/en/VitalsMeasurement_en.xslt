<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="1.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema">
	<!-- Comment this line to debug  --> <xsl:import href="/cernerbasiccontent/formats/vitalsmeasurement.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="../vitalsmeasurement.xslt" /> -->
	
	<!-- Values defined in this include file override the default values defined in vitalsmeasurement.xslt, VitalsMeasurementCommon.xslt and  CommonFxn.xslt-->
	<xsl:import href="/cernerbasiccontent/formats/en/vitalsmeasurementi18ncommon_en.xslt" />

	<!--For Visit Summary and Patient Facing templates we will display vital signs differently.
	For Patient Facing templates the value of isPatientFacingTemplate boolean will be true, else false.-->
	<xsl:variable name="isPatientFacingTemplate" as="xs:boolean" select="false()"/>
</xsl:stylesheet>