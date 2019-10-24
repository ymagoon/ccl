<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="1.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions">
	<!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/allergy.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="../allergy.xslt" /> -->
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'pt_br'"/>
	
	<!-- Strings defined for Allergy.xslt, String values defined here override the default values defined in Allergy.xslt -->
	<xsl:variable name="NoAllergies" as="xs:string">
		<xsl:value-of select="'Nenhuma alergia ativa'"/>
	</xsl:variable>
	
	<xsl:variable name="ReactionParentheses" as="xs:string">
		<xsl:value-of select="'(%s)'"/>
	</xsl:variable>
	
	<xsl:variable name="Reactions" as="xs:string">
		<xsl:value-of select="'%s, %s'"/>
	</xsl:variable>
	
</xsl:stylesheet>
