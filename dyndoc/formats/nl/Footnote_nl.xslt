<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="2.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions">
	<!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/footnote.xslt"/>
	<!-- Uncomment this line to debug  <xsl:import href="../footnote.xslt" /> -->
	<!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/nl/dateformat_nl.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="./dateformat_nl.xslt" /> -->
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>

	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'nl'"/>

	
	<!-- Strings defined for Footnote.xslt, String values defined here override the default values defined in Footnote.xslt -->
	<xsl:variable as="xs:string" name="FootnoteFormat">
		<xsl:value-of select="'%s; %s %s'"/>
	</xsl:variable>
	
</xsl:stylesheet>
