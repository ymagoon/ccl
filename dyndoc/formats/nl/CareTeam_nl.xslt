<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:n="urn:com-cerner-patient-ehr:v3">
	<!-- Comment this line to debug --> <xsl:import href="/cernerbasiccontent/formats/careteam.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="../careteam.xslt" /> -->
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'nl'"/>
	
	<!-- Strings defined for careteam.xslt, String values defined here override the default values defined in careteam.xslt -->
	<xsl:variable name="commaSeparator" as="xs:string" select="', %s'"/>
	
	<xsl:variable name="hyphenSeparator" as="xs:string" select="' -'"/>
	
</xsl:stylesheet>
