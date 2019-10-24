<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:fn="http://www.w3.org/2005/xpath-functions" xmlns:n="urn:com-cerner-patient-ehr:v3">

	<!-- Comment this line to debug--> <xsl:import href="/cernerbasiccontent/formats/goalsoutcomestable.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="../goalsoutcomestable.xslt" /> -->
	
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'es'"/>

	<!-- Strings defined for GoalsOutcomesTable.xslt, String values defined here override the default values defined in GoalsOutcomesTable.xslt -->
	<xsl:variable name="goalHeading" as="xs:string" select="'Descripci&#243;n de objetivos'"/>
	<xsl:variable name="isMetHeading" as="xs:string" select="'Cumplido/No cumplido'"/>
	<xsl:variable name="outcomeHeading" as="xs:string" select="'Resultado'"/>
	<xsl:variable name="metDisplay" as="xs:string" select="'Cumplido'"/>
	<xsl:variable name="notMetDisplay" as="xs:string" select="'No cumplido'"/>

</xsl:stylesheet>
