<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:fn="http://www.w3.org/2005/xpath-functions"
    xmlns:n="urn:com-cerner-patient-ehr:v3"
    xmlns:dd="DynamicDocumentation"
    exclude-result-prefixes="xsl xs fn n dd">

	<xsl:template name="emitTableStart">
		<xsl:param name="retainRowsInPlainText" as="xs:boolean" select="true()"/>
		
		<xsl:variable name="tableStart" as="xs:string">
			<xsl:choose>
				<xsl:when test="$retainRowsInPlainText = true()">
					<![CDATA[
					<table style="border-spacing:1.5em 0; border-collapse:collapse; border:1px solid #000; font-size:9pt;" dd:btnfloatingstyle="top-right" dd:zebrastripecolor="#F4F4F4" dd:zebraheadercolor="#F4F4F4" dd:whitespacecolseparator="true">
					]]>
				</xsl:when>
				<xsl:otherwise>
					<![CDATA[
					<table style="border-spacing:1.5em 0; border-collapse:collapse; border:1px solid #000; font-size:9pt;" dd:btnfloatingstyle="top-right" dd:zebrastripecolor="#F4F4F4" dd:zebraheadercolor="#F4F4F4" dd:whitespacecolseparator="false">
					]]>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
			
		<xsl:value-of select="$tableStart" disable-output-escaping="yes"/>
	</xsl:template>

  <xsl:template name="emitTableEnd">
   
    <xsl:variable name="tableEnd" as="xs:string">
		<![CDATA[
		</table>
		]]>
    </xsl:variable>

    <xsl:value-of select="$tableEnd" disable-output-escaping="yes"/>  
  </xsl:template>
  
	<xsl:template name="emitHeadingStart">
		<xsl:param name="repeatHeadingOnPrintedPages" as="xs:boolean" select="true()"/>
	
		<xsl:variable name="headingStart" as="xs:string">
			<xsl:choose>
				<xsl:when test="$repeatHeadingOnPrintedPages = true()">
					<![CDATA[
					<thead style="display:table-header-group;">
					<tr style="background-color:#F4F4F4; page-break-inside: avoid;">
					]]>
				</xsl:when>
				<xsl:otherwise>
					<![CDATA[
					<thead>
					<tr style="background-color:#F4F4F4; page-break-inside: avoid;">
					]]>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		
		<xsl:value-of select="$headingStart" disable-output-escaping="yes"/>		
	</xsl:template>
	
	<xsl:template name="emitHeadingEnd">

		<xsl:variable name="headingEnd" as="xs:string">
			<![CDATA[
			</tr>
			</thead>
			]]>
		</xsl:variable>

		<xsl:value-of select="$headingEnd" disable-output-escaping="yes"/>
	</xsl:template>
	
	<xsl:template name="emitSingleHeader">
		<xsl:param name="colName"/>
		
		<th style="font-weight:bold; text-align:center; vertical-align:top; padding:0 5px; padding-left:6px; border: 1px solid #000;"><xsl:value-of select="$colName"/></th>
	
	</xsl:template>
	
	<xsl:template name="emitTableCellStart">
		<xsl:variable name="quote">"</xsl:variable>
		<xsl:variable name="openBracket"><![CDATA[<]]></xsl:variable>
		<xsl:variable name="closeBracket"><![CDATA[>]]></xsl:variable>
		<xsl:value-of disable-output-escaping="yes" select="concat($openBracket, 'td style=', $quote, 'border:1px solid #000; padding-left:6px; vertical-align:top; padding:0 5px;', $quote, $closeBracket)"/>
	</xsl:template>

	<xsl:template name="emitTableCellEnd">
		<xsl:text disable-output-escaping="yes"><![CDATA[</td>]]></xsl:text>
	</xsl:template>
	
</xsl:stylesheet>

	