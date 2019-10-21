<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="1.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:fn="http://www.w3.org/2005/xpath-functions">
	<!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/socialhistory.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="../socialhistory.xslt" /> -->
	<!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/pt_br/dateformat_pt_br.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="./dateformat_pt_br.xslt" /> -->
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'pt_br'"/>
	
	<!-- Strings defined for SocialHistory.xslt, String values defined here override the default values defined in SocialHistory.xslt -->
	<xsl:variable name="UnableToObtain" as="xs:string">
		<xsl:value-of select="'N&#227;o foi poss&#237;vel obter o hist&#243;rico social'"/>
	</xsl:variable>

	<xsl:variable name="Assessments" as="xs:string">
		<xsl:value-of select="'%s, %s'"/>
	</xsl:variable>

	<xsl:variable name="Separator" as="xs:string">
		<xsl:value-of select="' - '"/>
	</xsl:variable>
	
	<xsl:variable name="SmokingStatus" as="xs:string">
		<xsl:value-of select="'Status de tabagista'"/>
	</xsl:variable>
	
	<xsl:variable name="SmokingStatusSeparator" as="xs:string">
		<xsl:value-of select="'%s; '"/>
	</xsl:variable>
	
	<xsl:variable name="DateSeparator" as="xs:string">
		<xsl:value-of select="', '"/>
	</xsl:variable>
	
</xsl:stylesheet>
