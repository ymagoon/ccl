<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:n="urn:com-cerner-patient-ehr:v3"
	xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
	xmlns:extfx="urn:com-cerner-physician-documentation-extension-functions"
	xmlns:doc="java:com.cerner.documentation.extension.XSLTFuncs"
	xmlns:dd="DynamicDocumentation"
	exclude-result-prefixes="xsl xs fn n cdocfx">
	
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<xsl:param as="xs:string" name="current-locale" select="'en_US'"/>
	
	<!-- required to include CommonFxn.xslt -->
	<!-- Comment this line to debug --> <xsl:include href="/cernerbasiccontent/formats/commonfxn.xslt" />
	<!-- Uncomment this line to debug <xsl:include href="commonfxn.xslt" /> -->
	
	<xsl:template match="/">
		
		<xsl:if test="n:report/n:clinical-data/n:patient-education-data/n:patient-education">
			<xsl:for-each select="n:report/n:clinical-data/n:patient-education-data/n:patient-education">
				
				<!-- sort by date time of patient education -->
				<xsl:sort select="n:update-dt-tm" order="descending"/>
				
				<div class="ddemrcontentitem ddremovable" dd:btnfloatingstyle="top-right">
					<xsl:attribute name="dd:entityid">
						<xsl:value-of select="@pat-ed-doc-activity-id"/>
					</xsl:attribute>
					<xsl:attribute name="dd:contenttype">
						<xsl:text>PATIENT_ED</xsl:text>
					</xsl:attribute>
					<xsl:if test="@pat-ed-reltn-desc">
						<xsl:value-of select="@pat-ed-reltn-desc"/>
					</xsl:if>
				</div>
			</xsl:for-each>
		</xsl:if>
			
	</xsl:template>

</xsl:stylesheet>