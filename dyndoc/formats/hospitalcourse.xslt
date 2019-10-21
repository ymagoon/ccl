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
	<!-- Comment this line to debug--> <xsl:include href="/cernerbasiccontent/formats/commonfxn.xslt" />
	<!-- Uncomment this line to debug <xsl:include href="commonfxn.xslt" /> -->
	
	<xsl:template match="/">
		
		<xsl:if test="n:report/n:clinical-data/n:patient-care-measurement-data/n:task-completion/n:measurement">
			<xsl:for-each select="n:report/n:clinical-data/n:patient-care-measurement-data/n:task-completion/n:measurement/n:value">
				
				<!-- sort by date time of patient education -->
				<xsl:sort select="n:update-dt-tm" order="descending"/>
					
				<div class="ddemrcontentitem ddremovable" dd:btnfloatingstyle="top-right">
					<xsl:attribute name="dd:entityid">
						<xsl:value-of select="@event-id"/>
					</xsl:attribute>
					<xsl:attribute name="dd:contenttype">
						<xsl:text>PATCARE_MEAS</xsl:text>
					</xsl:attribute>
					<xsl:if test="n:blob">
						<xsl:variable name="FoBlob" as="xs:string">
							<xsl:value-of select="n:blob"/>
						</xsl:variable>
						<xsl:variable name="Display" as="xs:string">
							<!-- The first flag indicates what style(s) to remove from the converted HTML
								 0-don't remove styles; 1-remove font face; 2-remove font size; 3-remove both font face and size
								 If this is 0 or 1, then the next four flags will be ignored.
								 
								 The next four flags indicate font size boundaries and the desired smallest and largest font sizes.
								 They represent lower bound, upper bound, desired smallest font size, and desired largest font size, respectively.
								 Font sizes smaller than or equal to the lower bound will be replaced with the desired smallest font size.
								 Font sizes larger than or equal to the upper bound will be replaced with the desired largest font size.
								 For example, doc:convertFOtoHTML($FoBlob,3,8,15,8,14) means font sizes <= 8pt will be replaced with 8pt;
								 while font sizes >= 15pt will be replaced with 14pt.
							-->
							<xsl:value-of select="doc:convertFOtoHTML($FoBlob,3,8,14,8,14)"/>
						</xsl:variable>
						<xsl:value-of disable-output-escaping="yes" select="$Display"/>
					</xsl:if>
				</div>
			</xsl:for-each>
		</xsl:if>
			
	</xsl:template>

</xsl:stylesheet>