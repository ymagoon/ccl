<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:n="urn:com-cerner-patient-ehr:v3"
	xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
	xmlns:dd="DynamicDocumentation"
	xmlns:java-string="java:java.lang.String"
	exclude-result-prefixes="xsl xs fn n cdocfx java-string">
	
	<!-- Comment this line to debug --> <xsl:import href="/cernerbasiccontent/formats/radscommon.xslt" />
	<!-- Uncomment this line to debug <xsl:import href="RadsCommon.xslt"/> -->

	<xsl:output method="html" encoding="UTF-8" indent="yes" />

	<xsl:param name="current-locale" as="xs:string" select="'en_US'" />
	
	<!-- main template -->
	<xsl:template match="/">
		<xsl:variable name="documents" select="n:report/n:clinical-data/n:radiology-data/n:radiology-document"/>
		
		<!-- Sort all rad exams together in alphabetical order and display each on a new line. -->
		<xsl:call-template name="sortRadiologyExams">
			<xsl:with-param name="radExams" select="$documents/n:radiology-exam"/>
		</xsl:call-template>
	</xsl:template>
</xsl:stylesheet>