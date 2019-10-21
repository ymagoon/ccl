<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="1.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions">
	<!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/medscategorized.xslt"/>
	<!-- Uncomment this line to debug  <xsl:import href="../medscategorized.xslt" /> -->

	<!-- Values defined in this include file override the default values defined in medscategorized.xslt, medsCommon.xslt, and  CommonFxn.xslt-->
	<xsl:import href="/cernerbasiccontent/formats/de/medsi18ncommon_de.xslt"/> 
	<xsl:variable name="IsIndented" as="xs:boolean">
		<xsl:value-of select="true()"/>
	</xsl:variable>

</xsl:stylesheet>
