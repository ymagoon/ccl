<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:fn="http://www.w3.org/2005/xpath-functions" xmlns:n="urn:com-cerner-patient-ehr:v3">

	<!-- Comment this line to debug--> <xsl:import href="/cernerbasiccontent/formats/goalsgoalstable.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="../goalsgoalstable.xslt" /> -->
	<!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/pt_br/dateformat_pt_br.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="./dateformat_pt_br.xslt" /> -->

	<xsl:output method="html" encoding="UTF-8" indent="yes"/>

	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'pt_br'"/>

	<!-- Strings defined for GoalsGoalsTable.xslt, String values defined here override the default values defined in GoalsGoalsTable.xslt -->
	<xsl:variable name="goalHeading" as="xs:string" select="'Descri&#231;&#227;o do objetivo'"/>
	<xsl:variable name="priorityHeading" as="xs:string" select="'Prioridade'"/>
	<xsl:variable name="startHeading" as="xs:string" select="'Data de in&#237;cio'"/>
	<xsl:variable name="endHeading" as="xs:string" select="'Data de t&#233;rmino'"/>
	<xsl:variable name="isMetHeading" as="xs:string" select="'Status'"/>

</xsl:stylesheet>
