<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="2.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions"> 
	<!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/labsv2.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="../labsv2.xslt" />-->
	<!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/es/dateformat_es.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="./dateformat_es.xslt" /> -->
	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'es'"/>
	
	<!-- Strings defined for labsv2.xslt, String values defined here override the default values defined in labsv2.xslt -->
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
		<xsl:value-of select="'(An&#243;malo)'"/>
	</xsl:variable>
	
	<xsl:variable name="ColumnHeadingOne" as="xs:string">
		<xsl:value-of select="'Nombre de la prueba'"/>
	</xsl:variable>
	
	<xsl:variable name="ColumnHeadingTwo" as="xs:string">
		<xsl:value-of select="'Resultado de la prueba'"/>
	</xsl:variable>
	
	<xsl:variable name="ColumnHeadingThree" as="xs:string">
		<xsl:value-of select="'Fecha/hora'"/>
	</xsl:variable>
	
	<xsl:variable name="ColumnHeadingFour" as="xs:string">
		<xsl:value-of select="'Comentarios'"/>
	</xsl:variable>
	
	<!-- overwrite showAllCompletedResults. If true, format will display all completed lab results without the 24 hour limit. -->
	<xsl:variable name="showAllCompletedResults" as="xs:boolean" select="true()"/>
	
	<!-- overwrite showResultComments. If true, format will display the comments associated to lab results. -->
	<xsl:variable name="showResultComments" as="xs:boolean" select="true()"/>
	
	<!-- overwrite showMostRecentResults. If true, format will display the most recent result when there is more than one result
		 with the same event code sequence. -->
	<xsl:variable name="showMostRecentResults" as="xs:boolean" select="false()"/>
</xsl:stylesheet>
