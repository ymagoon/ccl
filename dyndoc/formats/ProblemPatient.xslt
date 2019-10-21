<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="1.0"?>
<xsl:stylesheet version="2.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema" 
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:n="urn:com-cerner-patient-ehr:v3"
	xmlns:cdocfx="urn:com-cerner-physician-documentation-functions" 
	xmlns:dd="DynamicDocumentation"
	xmlns:java-string="java:java.lang.String"
	exclude-result-prefixes="xsl xs fn n cdocfx java-string">

	<!-- Required to include ProblemCommon.xslt -->
	<!-- Comment out this line to debug --> <xsl:import href="/cernerbasiccontent/formats/problemcommon.xslt"/>
	<!-- Uncomment this line to debug  <xsl:import href="ProblemCommon.xslt"/> -->

	<!-- Including Strings to be used -->
	<xsl:variable name="OngoingProblems" as="xs:string">
		<xsl:value-of select="'Ongoing - '"/>
	</xsl:variable>

	<xsl:variable name="HistoricalProblems" as="xs:string">
		<xsl:value-of select="'Historical - '"/>
	</xsl:variable>

	<xsl:variable name="OngoingDescription" as="xs:string">
		<xsl:value-of select="'Any problem that you are currently receiving treatment for.'"/>
	</xsl:variable>

	<xsl:variable name="HistoricalDescription" as="xs:string">
		<xsl:value-of select="'Any problem that you are no longer receiving treatment for.'"/>
	</xsl:variable>

	<xsl:variable name="IsSubsection" as="xs:boolean">
		<xsl:value-of select="false()"/>
	</xsl:variable>

	<xsl:variable name="ProblemDescriptionConnector" as="xs:string">
		<xsl:value-of select="'%1$s - %2$s'"/>
	</xsl:variable>

	<xsl:template match="/">
		<!-- display Ongoing Problems -->
		<xsl:if test="count($OngoingProblemNodes/n:problem) &gt; 0">
			<xsl:choose>
				<xsl:when test="$IsSubsection">
					<div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">
						<div style="margin-bottom:3px;">
							<xsl:variable name="DecoratedOngoingProblems" as="xs:string">
								<xsl:value-of select="concat('&lt;u&gt;', $OngoingProblems, '&lt;/u&gt;')"/>
							</xsl:variable>
							<xsl:value-of disable-output-escaping="yes" 
								select="java-string:format($ProblemDescriptionConnector,($DecoratedOngoingProblems, $OngoingDescription))"/>
						</div>
						<xsl:call-template name="cdocfx:displayOngoing">
							<xsl:with-param name="NKPNodes" select="$NKPNodes"/>
							<xsl:with-param name="OngoingProblemNodes" select="$OngoingProblemNodes"/>
						</xsl:call-template>
					</div>
				</xsl:when>
				<xsl:otherwise>
					<div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">
						<div style="margin-bottom:3px;">
							<strong>
								<span style="font-size:13pt;font-weight:bold">
									<xsl:value-of select="$OngoingProblems"/>
								</span>
							</strong>
							<xsl:value-of select="$OngoingDescription"/>
						</div>

						<xsl:call-template name="cdocfx:displayOngoing">
							<xsl:with-param name="NKPNodes" select="$NKPNodes"/>
							<xsl:with-param name="OngoingProblemNodes" select="$OngoingProblemNodes"/>
						</xsl:call-template>
					</div>
				</xsl:otherwise>
			</xsl:choose>
			
		</xsl:if>

		<!-- display Historical Problems -->
		<xsl:if test="count($HistoricalProblemNodes/n:problem) &gt; 0">
			<xsl:choose>
				<xsl:when test="$IsSubsection">
					<div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">
						<div style="margin-bottom:3px;">
							<xsl:variable name="DecoratedHistoricalProblems" as="xs:string">
								<xsl:value-of select="concat('&lt;u&gt;', $HistoricalProblems, '&lt;/u&gt;')"/>
							</xsl:variable>
							<xsl:value-of disable-output-escaping="yes"
								select="java-string:format($ProblemDescriptionConnector, ($DecoratedHistoricalProblems, $HistoricalDescription))"/>
						</div>
						<xsl:call-template name="cdocfx:displayHistorical">
							<xsl:with-param name="HistoricalProblemNodes" select="$HistoricalProblemNodes"/>
						</xsl:call-template>
					</div>
				</xsl:when>
				<xsl:otherwise>
					<div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">
						<!-- Horizontal rule separator if both Ongoing and Historical exist -->
						<xsl:if test="(count($HistoricalProblemNodes/n:problem) &gt; 0) and (count($OngoingProblemNodes/n:problem) &gt; 0)">
							<hr style="margin-top:8px;"/>
						</xsl:if>
						
						<div style="margin-bottom:3px;">
							<strong>
								<span style="font-size:13pt;font-weight:bold;">
									<xsl:value-of select="$HistoricalProblems"/>
								</span>
							</strong>
							<xsl:value-of select="$HistoricalDescription"/>
						</div>

						<xsl:call-template name="cdocfx:displayHistorical">
							<xsl:with-param name="HistoricalProblemNodes" select="$HistoricalProblemNodes"/>
						</xsl:call-template>
					</div>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>
