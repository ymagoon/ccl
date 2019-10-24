<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:fn="http://www.w3.org/2005/xpath-functions" xmlns:n="urn:com-cerner-patient-ehr:v3">
	<!-- Comment this line to debug --> <xsl:import href="/cernerbasiccontent/formats/demoaliaslocregproviders.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="../demoaliaslocregproviders.xslt" /> -->
	<!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/pt_br/dateformat_pt_br.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="./dateformat_pt_br.xslt" /> -->
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'pt_br'"/>
	
	<!-- Strings defined for demoaliaslocregproviders.xslt, String values defined here override the default values defined in demoaliaslocregproviders.xslt -->
	<xsl:variable name="MRN" as="xs:string">
		<xsl:value-of select="'PRT:'"/>
	</xsl:variable>
	
	<xsl:variable name="FIN" as="xs:string">
		<xsl:value-of select="'FIN:'"/>
	</xsl:variable>
	
	<xsl:variable name="Location" as="xs:string">
		<xsl:value-of select="'Local:'"/>
	</xsl:variable>
	
	<xsl:variable name="RegDtTm" as="xs:string">
		<xsl:value-of select="'Data e hora do registro:'"/>
	</xsl:variable>
	
	<xsl:variable name="PCP" as="xs:string">
		<xsl:value-of select="'Cl&#237;nico geral:'"/>
	</xsl:variable>
	
	<xsl:variable name="CommaSeparator" as="xs:string">
		<xsl:value-of select="', %s'"/>
	</xsl:variable>
	
</xsl:stylesheet>
