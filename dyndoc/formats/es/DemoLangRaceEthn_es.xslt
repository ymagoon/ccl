<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:fn="http://www.w3.org/2005/xpath-functions" xmlns:n="urn:com-cerner-patient-ehr:v3">
	<!-- Comment this line to debug --> <xsl:import href="/cernerbasiccontent/formats/demolangraceethn.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="../demolangraceethn.xslt" /> -->
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'es'"/>
	
	<!-- Strings defined for demolangraceethn.xslt, String values defined here override the default values defined in demolangraceethn.xslt -->
	<xsl:variable name="Language" as="xs:string">
		<xsl:value-of select="'Idioma:'"/>
	</xsl:variable>
	
	<xsl:variable name="Race" as="xs:string">
		<xsl:value-of select="'Raza:'"/>
	</xsl:variable>
	
	<xsl:variable name="Ethnicity" as="xs:string">
		<xsl:value-of select="'Origen &#233;tnico:'"/>
	</xsl:variable>
	
</xsl:stylesheet>
