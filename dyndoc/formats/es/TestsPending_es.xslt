<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions">
	<!-- Comment this line to debug --> <xsl:import href="/cernerbasiccontent/formats/testspending.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="../testspending.xslt" /> -->
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'es'"/>
	
	<!-- overwrite ignoreDateTimeThreshold.
		 If true, format will only display tests which are not in COMPLETED status under Tests Pending and all the completed results will be displayed
		 under Lab Results and Radiology Results (irrespective of the 24 hour limit) depending on the type.
		 If false, format will display tests which are not in COMPLETED status as well as tests which are in COMPLETED status but were charted within last
		 24 hours under Tests Pending. -->
	<xsl:variable name="ignoreDateTimeThreshold" as="xs:boolean" select="true()"/>
</xsl:stylesheet>