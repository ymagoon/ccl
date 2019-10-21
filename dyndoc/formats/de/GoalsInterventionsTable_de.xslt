<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:fn="http://www.w3.org/2005/xpath-functions" xmlns:n="urn:com-cerner-patient-ehr:v3">

	<!-- Comment this line to debug--> <xsl:import href="/cernerbasiccontent/formats/goalsinterventionstable.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="../goalsinterventionstable.xslt" /> -->
	<!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/de/dateformat_de.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="./dateformat_de.xslt" /> -->
	
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'de'"/>

	<!-- Strings defined for GoalsInterventionsTable.xslt, String values defined here override the default values defined in GoalsInterventionsTable.xslt -->
	<xsl:variable name="interventionHeading" as="xs:string" select="'Interventionsbeschreibung'"/>
	<xsl:variable name="categoryHeading" as="xs:string" select="'Kategorie'"/>
	<xsl:variable name="typeHeading" as="xs:string" select="'Typ/Quelle'"/>
	<xsl:variable name="startHeading" as="xs:string" select="'Beginndatum'"/>
	<xsl:variable name="isMetHeading" as="xs:string" select="'Status'"/>
	<xsl:variable name="commentHeading" as="xs:string" select="'Kommentare'"/>
	<xsl:variable name="metDisplay" as="xs:string" select="'Erreicht'"/>
	<xsl:variable name="notMetDisplay" as="xs:string" select="'Nicht erreicht'"/>

</xsl:stylesheet>
