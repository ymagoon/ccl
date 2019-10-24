<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema" 
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:xr-date-formatter="java:com.cerner.xsl.util.XSLTDateUtilities"
	xmlns:n="urn:com-cerner-patient-ehr:v3"
	xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
	xmlns:extfx="urn:com-cerner-physician-documentation-extension-functions"
	xmlns:doc="java:com.cerner.documentation.extension.XSLTFuncs"
	xmlns:dd="DynamicDocumentation"
	xmlns:java-string="java:java.lang.String"
	exclude-result-prefixes="xsl xs fn n cdocfx xr-date-formatter extfx doc dd java-string">

	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<xsl:param as="xs:string" name="current-locale" select="'en_US'"/>
	
	<!-- required to include CommonFxn.xslt -->
	<!-- Comment this line to debug --> <xsl:include href="/cernerbasiccontent/formats/commonfxn.xslt" />
	<!-- Uncomment this line to debug <xsl:include href="commonfxn.xslt" /> -->
	
	<!-- Default string constants -->
	<xsl:variable name="Language" as="xs:string">
		<xsl:value-of select="'Language:'"/>
	</xsl:variable>
	
	<xsl:variable name="Race" as="xs:string">
		<xsl:value-of select="'Race:'"/>
	</xsl:variable>
	
	<xsl:variable name="Ethnicity" as="xs:string">
		<xsl:value-of select="'Ethnicity:'"/>
	</xsl:variable>
	
	<!-- Keys -->
	<xsl:key name="keyCode" match="n:report/n:code-list/n:code" use="@code"/>
	
	<xsl:template match="/">
		
		<xsl:if test="n:report/n:demographics/n:patient-info/@primary-language-code or n:report/n:demographics/n:patient-info/n:race-code or n:report/n:demographics/n:patient-info/n:ethnicity-code">
			
			<div class="ddemrcontentitem ddremovable" dd:btnfloatingstyle="top-right">
				<xsl:attribute name="dd:entityid">
					<xsl:if test="n:report/n:clinical-data/n:encounter-data/n:encounter/@encounter-id">
						<xsl:value-of select="n:report/n:clinical-data/n:encounter-data/n:encounter/@encounter-id"/>
					</xsl:if>	
				</xsl:attribute>
				<xsl:attribute name="dd:contenttype">
					<xsl:text>ENCNTRINFO</xsl:text>
				</xsl:attribute>
				
				<xsl:if test="n:report/n:demographics/n:patient-info/@primary-language-code">
					<xsl:if test="key('keyCode', n:report/n:demographics/n:patient-info/@primary-language-code)/@display">
						<div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">
							<xsl:value-of select="$Language"/>
							<span style="margin-left:1ex;"><xsl:value-of select="key('keyCode', n:report/n:demographics/n:patient-info/@primary-language-code)/@display"/></span>
						</div>	
					</xsl:if>
				</xsl:if>
				
				<xsl:if test="n:report/n:demographics/n:patient-info/n:race-code">
					<xsl:if test="key('keyCode', n:report/n:demographics/n:patient-info/n:race-code)/@display">
						<div style="clear:both; overflow:hidden;" class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">	
							<div style="float:left;">
								<xsl:value-of select="$Race"/>
							</div>
							<div style="float:left; margin-left:1ex;">
								<xsl:for-each select="n:report/n:demographics/n:patient-info/n:race-code">
									<xsl:choose>
										<xsl:when test="position()!=last()">
											<xsl:value-of select="key('keyCode', .)/@display"/><br />
										</xsl:when>
										<xsl:otherwise>
											<xsl:value-of select="key('keyCode', .)/@display"/>
										</xsl:otherwise>
									</xsl:choose>
								</xsl:for-each>
							</div>
						</div>	
					</xsl:if>	
				</xsl:if>
				
				<xsl:if test="n:report/n:demographics/n:patient-info/n:ethnicity-code">
					<xsl:if test="key('keyCode', n:report/n:demographics/n:patient-info/n:ethnicity-code)/@display">	
						<div style="clear:both; overflow:hidden;" class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">	
							<div style="float:left;">	
								<xsl:value-of select="$Ethnicity"/>
							</div>
							<div style="float:left; margin-left:1ex;">
								<xsl:for-each select="n:report/n:demographics/n:patient-info/n:ethnicity-code">
									<xsl:choose>
										<xsl:when test="position()!=last()">
											<xsl:value-of select="key('keyCode', .)/@display"/><br />
										</xsl:when>
										<xsl:otherwise>
											<xsl:value-of select="key('keyCode', .)/@display"/>
										</xsl:otherwise>
									</xsl:choose>
								</xsl:for-each>
							</div>
						</div>	
					</xsl:if>	
				</xsl:if>
				
			</div>
			
		</xsl:if>
		
	</xsl:template>
	
</xsl:stylesheet>