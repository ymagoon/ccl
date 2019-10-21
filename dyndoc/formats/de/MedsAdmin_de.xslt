<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema">
	<!-- Comment this line to debug --> <xsl:import href="/cernerbasiccontent/formats/medsadmin.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="../medsadmin.xslt" /> -->
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'de'"/>
	
	<!-- Strings defined for medsadmin.xslt, String values defined here override the default values defined in medsadmin.xslt -->
	<xsl:variable name="Separator" as="xs:string"> <!-- Seperator between detail components -->
		<xsl:value-of select="', %s'"/>
	</xsl:variable>
	<xsl:variable name="Connect" as="xs:string"> <!-- Connect two strings as one with a space in between -->
		<xsl:value-of select="'%s %s'"/>
	</xsl:variable>
	<xsl:variable name="Given" as="xs:string"> <!-- Label for Given Meds and Immunizations grouper -->
		<xsl:value-of select="'Verabreicht'"/>
	</xsl:variable>
	<xsl:variable name="NotGiven" as="xs:string"> <!-- Label for Not Given Immunizations grouper -->
		<xsl:value-of select="'Nicht verabreicht'"/>
	</xsl:variable>
	<xsl:variable name="Period" as="xs:string">	<!-- Seperator between med order and diagnoses -->
		<xsl:value-of select="'. %s'"/>
	</xsl:variable>
	<xsl:variable name="For" as="xs:string"> <!-- Label for indicating Diagnoses -->
		<xsl:value-of select="'F&#252;r: '"/>
	</xsl:variable>  
	
</xsl:stylesheet>
