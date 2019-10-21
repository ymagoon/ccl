<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="1.0"?>
<xsl:stylesheet version="2.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema" 
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:n="urn:com-cerner-patient-ehr:v3"
	xmlns:cdocfx="urn:com-cerner-physician-documentation-functions" 
	xmlns:dd="DynamicDocumentation"
	exclude-result-prefixes="xsl xs fn n cdocfx">

	<!-- Required to include ProblemCommon.xslt -->
	<!-- Comment out this line to debug --> <xsl:import href="/cernerbasiccontent/formats/problemcommon.xslt"/>
	<!-- Uncomment this line to debug  <xsl:import href="ProblemCommon.xslt"/> -->
	
	<!-- Including Strings to be used -->
	<xsl:variable name="OngoingProblems" as="xs:string">
		<xsl:value-of select="'Ongoing'"/>
	</xsl:variable>
	
	<xsl:variable name="HistoricalProblems" as="xs:string">
		<xsl:value-of select="'Historical'"/>
	</xsl:variable>
	
	<xsl:variable name="NoQualifyingData" as="xs:string">
		<xsl:value-of select="'No qualifying data'"/>
	</xsl:variable>
	
	<xsl:template match="/">
		<!--Ongoing Problems -->
		<div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">
			<span style="text-decoration: underline;">
				<xsl:value-of select="$OngoingProblems"/>
			</span>

			<xsl:call-template name="cdocfx:displayOngoing">
				<xsl:with-param name="NKPNodes" select="$NKPNodes"/>
				<xsl:with-param name="OngoingProblemNodes" select="$OngoingProblemNodes"/>
			</xsl:call-template>
		</div>

		<!-- Historical Problems -->
		<div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">
			<span style="text-decoration: underline;">
				<xsl:value-of select="$HistoricalProblems"/>
			</span>

			<xsl:call-template name="cdocfx:displayHistorical">
				<xsl:with-param name="HistoricalProblemNodes" select="$HistoricalProblemNodes"/>
			</xsl:call-template>
		</div>
	</xsl:template>
</xsl:stylesheet>
