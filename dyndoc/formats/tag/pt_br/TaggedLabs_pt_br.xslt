<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="2.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions">
	<!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/tag/taggedlabs.xslt"/> 
	<!-- Uncomment this line to debug  <xsl:import href="../taggedlabs.xslt" /> -->
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>

	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'pt_br'"/>
	
	<!-- Strings defined for TaggedLabs.xslt, String values defined here override the default values defined in TaggedLabs.xslt -->
	<xsl:variable name="DATE_SEQUENCE_UTC_ON" as="xs:string" select="'dd/MM/yyyy HH:mm zzz'"/>
	<xsl:variable name="DATE_SEQUENCE_UTC_OFF" as="xs:string" select="'dd/MM/yyyy HH:mm'"/>
	
	<xsl:variable name="LabUnit" as="xs:string">
		<xsl:value-of select="'(%s)'"/>
	</xsl:variable>
	
</xsl:stylesheet>
