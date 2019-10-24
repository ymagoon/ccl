<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" 
    xmlns:fn="http://www.w3.org/2005/xpath-functions" 
    xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
    xmlns:n="urn:com-cerner-patient-ehr:v3" 
    xmlns:dd="DynamicDocumentation"
    exclude-result-prefixes="xsl xs fn cdocfx n dd">
    
    <!-- Comment this line to debug--> <xsl:import href="/cernerbasiccontent/formats/healthconcerns.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="../healthconcerns.xslt" /> -->
	
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'de'"/>
	
	<xsl:variable name="commentDisplayFormat" as="xs:string" select="'Kommentare: %s'"/>
</xsl:stylesheet>