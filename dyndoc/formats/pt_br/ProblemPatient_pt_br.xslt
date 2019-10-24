<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="1.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:fn="http://www.w3.org/2005/xpath-functions">
	
	<!-- Comment this line to debug --> <xsl:import href="/cernerbasiccontent/formats/problempatient.xslt"/>
	<!-- Uncomment this line to debug  <xsl:import href="../problempatient.xslt" /> -->
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>

	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'pt_br'"/>

	<!-- Strings defined for Problem.xslt, String values defined here override the default values defined in Problem.xslt -->
	<xsl:variable name="OngoingProblems" as="xs:string">
		<xsl:value-of select="'Em andamento - '"/>
	</xsl:variable>

	<xsl:variable name="HistoricalProblems" as="xs:string">
		<xsl:value-of select="'Hist&#243;rico - '"/>
	</xsl:variable>
	
	<xsl:variable name="OngoingDescription" as="xs:string">
		<xsl:value-of select="'Qualquer problema para o qual voc&#234; esteja sendo tratado.'"/>
	</xsl:variable>
	
	<xsl:variable name="HistoricalDescription" as="xs:string">
		<xsl:value-of select="'Qualquer problema para o qual voc&#234; n&#227;o esteja mais sendo tratado.'"/>
	</xsl:variable>

	<xsl:variable name="NoChronicProblems" as="xs:string">
		<xsl:value-of select="'Sem problemas cr&#244;nicos'"/>
	</xsl:variable>
	
</xsl:stylesheet>
