<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="1.0"?>
<xsl:stylesheet version="2.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:fo="http://www.w3.org/1999/XSL/Format"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:n="urn:com-cerner-patient-ehr:v3"
	xmlns:dd="DynamicDocumentation"
	exclude-result-prefixes="xsl fo xs fn dd n">

	<xsl:output method="html" encoding="UTF-8" indent="yes" />
	<xsl:param as="xs:string" name="current-locale" select="'en_US'"/>

	<!-- Required to include CommonFxn.xslt -->
	<!-- Comment this line to debug --><xsl:include href="/cernerbasiccontent/formats/patcaremeasurementcommon.xslt" /> 
	<!-- Uncomment this line to debug  <xsl:include href="patcaremeasurementcommon.xslt" /> -->

	<!-- Get a Sorted List of PatCareMeasurement Nodes sorted by performed date -->
	<xsl:variable name="MeasurementNodes">
		<xsl:perform-sort select="n:report/n:clinical-data/n:patient-care-measurement-data/n:task-completion" >
			<xsl:sort select="@recorded-dt-tm" order="descending" />
		</xsl:perform-sort>
	</xsl:variable>
	
	<xsl:template match="/">
		<xsl:if test="exists($MeasurementNodes)">
			<!-- ASSUMPTION: Only one measurement can be documented at a time, and we only support showing one. -->
			<xsl:variable name="LatestMeasurement" select="$MeasurementNodes/n:task-completion[1]/n:measurement[1]" />
			<xsl:if test="exists($LatestMeasurement)">
				<div class="ddemrcontentitem ddremovable" >
					<xsl:call-template name="tempOutputMeasurementValueInterpretation">
						<xsl:with-param name="measurement" select="$LatestMeasurement"/>
						<xsl:with-param name="dateTimeFormat" select="$DATE_SEQUENCE"/>
						<xsl:with-param name="dateOnlyFormat" select="$DATE_ONLY_SEQUENCE"/>
						<xsl:with-param name="valueUnitFormat" select="$measValueUnit"/>
					</xsl:call-template>
				</div>
			</xsl:if>
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>
