<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="1.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema">
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>

	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'nl'"/>
	<!-- Backend system locale passed as a paramter -->
	<xsl:param as="xs:string" name="SystemLocale" select="''"/>	

	<!-- Strings defined for MedsCommon.xslt, Meds.xslt, and MedsCategorized.xslt, String values defined here override the default values defined in these XSLT files. -->
	<xsl:variable name="Separator" as="xs:string">	<!-- Seperator between detail components -->
		<xsl:value-of select="',  %s'"/>
	</xsl:variable>
	<xsl:variable name="Connect" as="xs:string"> 	<!-- Connect two strings as one with a space in between -->
		<xsl:value-of select="'%s %s'"/>
	</xsl:variable>
	<xsl:variable name="OrderComplianceComment" as="xs:string">
		<xsl:value-of select="':  %s'"/>
	</xsl:variable>
	<xsl:variable name="Prn" as="xs:string">
		<xsl:value-of select="'Zo nodig'"/>
	</xsl:variable>
	<xsl:variable name="Refills" as="xs:string">
		<xsl:value-of select="'herhaalrecepten'"/>
	</xsl:variable>
	<xsl:variable name="NoMeds" as="xs:string">
		<xsl:value-of select="'Geen actieve medicaties'"/>
	</xsl:variable>
	<xsl:variable name="NoInpatientMeds" as="xs:string">
		<xsl:value-of select="'Geen actieve intern verpleegde pati&#235;nt medicaties'"/>
	</xsl:variable>
	<xsl:variable name="NoHomeMeds" as="xs:string">
		<xsl:value-of select="'Geen actieve thuismedicaties'"/>
	</xsl:variable>
	<xsl:variable name="sCatTitleInpatient" as="xs:string">
		<xsl:value-of select="'Intern verpleegde pati&#235;nt'"/>
	</xsl:variable>
	<xsl:variable name="sCatTitleHome" as="xs:string">
		<xsl:value-of select="'Thuis'"/>
	</xsl:variable>

</xsl:stylesheet>
