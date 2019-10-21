<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="1.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:fo="http://www.w3.org/1999/XSL/Format"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:n="urn:com-cerner-patient-ehr:v3"
	xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
	xmlns:dd="DynamicDocumentation"
	exclude-result-prefixes="xsl xs fo fn n cdocfx dd">

	<xsl:output method="html" encoding="UTF-8" indent="yes" />
	<xsl:param as="xs:string" name="current-locale" select="'en_US'"/>

	<!-- Required to include CommonFxn.xslt -->
	<!-- Comment this line to debug --> <xsl:include href="/cernerbasiccontent/formats/patcaremeasurementcommon.xslt" /> 
	<!-- Uncomment this line to debug  <xsl:include href="patcaremeasurementcommon.xslt" /> -->

	<!-- Get a Sorted List of PatCareMeasurement Nodes sorted by concept CKI. DO NOT COPY IF YOU DON'T WANT TO SORT BY CONCEPT CKI. -->
	<xsl:variable name="MeasurementNodes">
		<xsl:perform-sort select="n:report/n:clinical-data/n:patient-care-measurement-data/n:task-completion/n:measurement" >
			<xsl:sort select="n:event-type/@concept-cki" order="descending"/>
		</xsl:perform-sort>
	</xsl:variable>
	
	<xsl:template match="/">
		<xsl:if test="exists($MeasurementNodes)">
			<!-- Output each measurement comma separated. -->
			<xsl:for-each select="$MeasurementNodes/n:measurement">
				<span class="ddemrcontentitem ddremovable">
					<xsl:call-template name="tempOutputMeasurementValueInterpretation">
						<xsl:with-param name="measurement" select="."/>
						<xsl:with-param name="dateTimeFormat" select="$DATE_SEQUENCE"/>
						<xsl:with-param name="dateOnlyFormat" select="$DATE_ONLY_SEQUENCE"/>
						<xsl:with-param name="valueUnitFormat" select="$measValueUnit"/>
					</xsl:call-template>
					<xsl:if test="not(position() = last())">
						<xsl:value-of select="$multiValueSeparator"/>
					</xsl:if>
				</span>	
			</xsl:for-each>
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>
