<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:n="urn:com-cerner-patient-ehr:v3">

	<!-- Comment this line to debug--> <xsl:import href="/cernerbasiccontent/formats/goalsgoalstable.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="../goalsgoalstable.xslt" /> -->
        <!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/en/dateformat_en.xslt"/>
        <!-- Uncomment this line to debug <xsl:import href="./dateformat_en.xslt" /> -->

	<xsl:output method="html" encoding="UTF-8" indent="yes"/>

	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'en_US'"/>

	<!-- Strings defined for GoalsGoalsTable.xslt, String values defined here override the default values defined in GoalsGoalsTable.xslt -->
	<xsl:variable name="goalHeading" as="xs:string" select="'Goal Description'"/>
	<xsl:variable name="priorityHeading" as="xs:string" select="'Priority'"/>
	<xsl:variable name="startHeading" as="xs:string" select="'Start Date'"/>
	<xsl:variable name="endHeading" as="xs:string" select="'End Date'"/>
	<xsl:variable name="isMetHeading" as="xs:string" select="'Status'"/>

</xsl:stylesheet>