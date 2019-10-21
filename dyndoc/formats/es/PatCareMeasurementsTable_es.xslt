<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	exclude-result-prefixes="xsl xs">
	
	<!-- Comment this line to debug --> <xsl:import href="/cernerbasiccontent/formats/patcaremeasurementstable.xslt"/> 
	<!-- Uncomment this line to debug <xsl:import href="../patcaremeasurementstable.xslt" /> -->
	<!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/es/dateformat_es.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="./dateformat_es.xslt" /> -->
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'es'"/>
	
	<!-- Strings defined for patcaremeasurementstable.xslt, String values defined here override the default values defined in patcaremeasurementstable.xslt -->
	<xsl:variable name="measValueUnit" as="xs:string" select="'%s %s'"/>
	<xsl:variable name="measValueInterpretation" as="xs:string" select="'%s %s'" />
	
	<xsl:variable name="NormalHigh" as="xs:string">
		<xsl:value-of select="'(Alto)'"/>
	</xsl:variable>
	
	<xsl:variable name="NormalLow" as="xs:string">
		<xsl:value-of select="'(Bajo)'"/>
	</xsl:variable>
	
	<xsl:variable name="Critical" as="xs:string">
		<xsl:value-of select="'(Cr&#237;tico)'"/>
	</xsl:variable>
	
	<xsl:variable name="Abnormal" as="xs:string">
		<xsl:value-of select="'(An&#243;mal)'"/>
	</xsl:variable>
	
	<xsl:variable name="ColumnHeadingOne" as="xs:string">
		<xsl:value-of select="'Evaluaci&#243;n'"/>
	</xsl:variable>
	
	<xsl:variable name="ColumnHeadingTwo" as="xs:string">
		<xsl:value-of select="'Resultado'"/>
	</xsl:variable>
	
	<xsl:variable name="ColumnHeadingThree" as="xs:string">
		<xsl:value-of select="'Comentarios'"/>
	</xsl:variable>

	<xsl:variable name="ShowComments" as="xs:boolean">
		<xsl:value-of select="true()"/>
	</xsl:variable>
</xsl:stylesheet>