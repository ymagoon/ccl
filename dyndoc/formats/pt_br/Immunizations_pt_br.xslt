<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:fn="http://www.w3.org/2005/xpath-functions" xmlns:n="urn:com-cerner-patient-ehr:v3">
	<!-- Comment this line to debug --> <xsl:import href="/cernerbasiccontent/formats/immunizations.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="../immunizations.xslt" /> -->
	<!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/pt_br/dateformat_pt_br.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="./dateformat_pt_br.xslt" /> -->
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'pt_br'"/>
	
	<!-- Strings defined for Immunizations.xslt, String values defined here override the default values defined in Immunizations.xslt -->
	<xsl:variable name="Vaccine" as="xs:string">
		<xsl:value-of select="'Vacina'"/>
	</xsl:variable>
	
	<xsl:variable name="Date" as="xs:string">
		<xsl:value-of select="'Data'"/>
	</xsl:variable>
	
	<xsl:variable name="Status" as="xs:string">
		<xsl:value-of select="'Status'"/>
	</xsl:variable>
	
	<xsl:variable name="Comment" as="xs:string">
		<xsl:value-of select="'Coment&#225;rios'"/>
	</xsl:variable>
	
	<xsl:variable name="ShowComments" as="xs:boolean">
		<xsl:value-of select="true()"/>
	</xsl:variable>

	<xsl:variable name="Given" as="xs:string">
		<xsl:value-of select="'Administrada'"/>
	</xsl:variable>
	
	<xsl:variable name="NotGiven" as="xs:string">
		<xsl:value-of select="'N&#227;o administrada'"/>
	</xsl:variable>
	
	<xsl:variable name="Recorded" as="xs:string">
		<xsl:value-of select="'Registrado'"/>
	</xsl:variable>
	
	<xsl:variable name="MonthPrecisionFormatter" as="xs:string">
		<xsl:value-of select="'%1$s/%2$s'"/> <!-- %1$s is month, %2$s is year -->
	</xsl:variable>
	
	<xsl:variable name="DayPrecisionFormatter" as="xs:string">
		<xsl:value-of select="'%2$s/%1$s/%3$s'"/> <!-- %1$s is month, %2$s is day, %3$s is year -->
	</xsl:variable>
	
</xsl:stylesheet>
