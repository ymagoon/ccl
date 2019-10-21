<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	exclude-result-prefixes="xsl xs">
	
	<!-- Comment this line to debug --> <xsl:import href="/cernerbasiccontent/formats/patcaremeasurementstable.xslt"/> 
	<!-- Uncomment this line to debug <xsl:import href="../patcaremeasurementstable.xslt" /> -->
	<!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/fr/dateformat_fr.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="./dateformat_fr.xslt" /> -->
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'fr'"/>
	
	<!-- Strings defined for patcaremeasurementstable.xslt, String values defined here override the default values defined in patcaremeasurementstable.xslt -->
	<xsl:variable name="measValueUnit" as="xs:string" select="'%s %s'"/>
	<xsl:variable name="measValueInterpretation" as="xs:string" select="'%s %s'" />
	
	<xsl:variable name="NormalHigh" as="xs:string">
		<xsl:value-of select="'(&#201;lev&#233;)'"/>
	</xsl:variable>
	
	<xsl:variable name="NormalLow" as="xs:string">
		<xsl:value-of select="'(Faible)'"/>
	</xsl:variable>
	
	<xsl:variable name="Critical" as="xs:string">
		<xsl:value-of select="'(Critique)'"/>
	</xsl:variable>
	
	<xsl:variable name="Abnormal" as="xs:string">
		<xsl:value-of select="'(Anormal)'"/>
	</xsl:variable>
	
	<xsl:variable name="ColumnHeadingOne" as="xs:string">
		<xsl:value-of select="'&#201;valuation'"/>
	</xsl:variable>
	
	<xsl:variable name="ColumnHeadingTwo" as="xs:string">
		<xsl:value-of select="'R&#233;sultat'"/>
	</xsl:variable>
	
	<xsl:variable name="ColumnHeadingThree" as="xs:string">
		<xsl:value-of select="'Commentaires'"/>
	</xsl:variable>

	<xsl:variable name="ShowComments" as="xs:boolean">
		<xsl:value-of select="true()"/>
	</xsl:variable>
</xsl:stylesheet>