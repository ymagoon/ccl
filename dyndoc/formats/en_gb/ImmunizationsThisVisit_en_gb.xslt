<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:n="urn:com-cerner-patient-ehr:v3">
	<!-- Comment this line to debug --> <xsl:import href="/cernerbasiccontent/formats/immunizationsthisvisit.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="../immunizationsthisvisit.xslt" /> -->
	<!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/en_gb/dateformat_en_gb.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="./dateformat_en_gb.xslt" /> -->
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'en_GB'"/>
	
	<!-- Strings defined for immunizationsthisvisit.xslt, String values defined here override the default values defined in immunizationsthisvisit.xslt -->
	<xsl:variable name="Vaccine" as="xs:string">
		<xsl:value-of select="'Vaccine'"/>
	</xsl:variable>
	
	<xsl:variable name="Date" as="xs:string">
		<xsl:value-of select="'Date'"/>
	</xsl:variable>
	
	<xsl:variable name="Status" as="xs:string">
		<xsl:value-of select="'Status'"/>
	</xsl:variable>
	
	<xsl:variable name="Comment" as="xs:string">
		<xsl:value-of select="'Comments'"/>
	</xsl:variable>
	
	<xsl:variable name="Given" as="xs:string">
		<xsl:value-of select="'Given'"/>
	</xsl:variable>
	
	<xsl:variable name="NotGiven" as="xs:string">
		<xsl:value-of select="'Not Given'"/>
	</xsl:variable>
	
	<xsl:variable name="Recorded" as="xs:string">
		<xsl:value-of select="'Recorded'"/>
	</xsl:variable>
	
	<xsl:variable name="MonthPrecisionFormatter" as="xs:string">
		<xsl:value-of select="'%1$s/%2$s'"/> <!-- %1$s is month, %2$s is year -->
	</xsl:variable>
	
	<xsl:variable name="DayPrecisionFormatter" as="xs:string">
		<xsl:value-of select="'%2$s/%1$s/%3$s'"/> <!-- %1$s is month, %2$s is day, %3$s is year -->
	</xsl:variable>
	
</xsl:stylesheet>