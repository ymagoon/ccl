<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="1.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions">
	<!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/dxorder.xslt"/>
	<!-- Uncomment this line to debug  <xsl:import href="../dxorder.xslt" /> -->
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'fr'"/>
	
	<!-- Strings defined for DxOrder.xslt, String values defined here override the default values defined in DxOrder.xslt -->
	<xsl:variable name="Ordered" as="xs:string">
		<xsl:value-of select="'Prescrit&#160;: '"/>
	</xsl:variable>
	
	<xsl:variable name="AdditionalOrders" as="xs:string">
		<xsl:value-of select="'Prescriptions&#160;: '"/>
	</xsl:variable>

</xsl:stylesheet>
