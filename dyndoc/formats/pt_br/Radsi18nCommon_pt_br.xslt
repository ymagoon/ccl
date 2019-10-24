<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema">

	<!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/pt_br/dateformat_pt_br.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="./dateformat_pt_br.xslt" /> -->
	<xsl:output method="html" encoding="UTF-8" indent="yes" />

	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param name="current-locale" as="xs:string" select="'pt_br'" />

	<!-- Strings defined for Rads.xslt and RadsCommon.xslt. String values defined here override the default values defined in RadsCommon.xslt -->
	<!-- This format is used in patient facing templates as well as in provider facing templates when none of the documents have a valid interpretation. -->
	<!-- Radiology result display format with result date: "[radiology-display] [result-date]" -->
	<xsl:variable name="DisplayWithoutIntepretation" as="xs:string">
		<xsl:value-of select="'%s %s'"/>
	</xsl:variable>

</xsl:stylesheet>