<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="1.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:n="urn:com-cerner-patient-ehr:v3"
	xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
	xmlns:dd="DynamicDocumentation"
	exclude-result-prefixes="xsl xs fn n cdocfx">

	<!-- Comment out this line to debug --> <xsl:import href="/cernerbasiccontent/formats/medscommon.xslt"/>
	<!-- Uncomment this line to debug	<xsl:import href="MedsCommon.xslt"/> -->

	<xsl:variable name="NoMeds" as="xs:string">
		<xsl:value-of select="'No active medications'"/>
	</xsl:variable>

	<xsl:template match="/">

		<xsl:choose>
			<xsl:when test="n:report/n:clinical-data/n:order-data/n:medication-order">
				<xsl:apply-templates select="n:report/n:clinical-data/n:order-data/n:medication-order">
					<xsl:sort select="fn:upper-case(@clinical-name)"/>
				</xsl:apply-templates>
			</xsl:when>

			<xsl:otherwise>
				<xsl:value-of select="$NoMeds"/>
			</xsl:otherwise>

		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>
