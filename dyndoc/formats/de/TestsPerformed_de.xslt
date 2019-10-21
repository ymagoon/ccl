<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions">
	<!-- Comment this line to debug --> <xsl:import href="/cernerbasiccontent/formats/testsperformed.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="../testsperformed.xslt" /> -->
	<!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/de/dateformat_de.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="./dateformat_de.xslt" /> -->
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	
	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'de'"/>
	
	<!-- Strings defined for testsperformed.xslt, String values defined here override the default values defined in testsperformed.xslt -->
	<xsl:variable name="ResultsPending" as="xs:string">
		<strong>
			<xsl:value-of select="'-- Ausstehende Ergebnisse --'"/>
		</strong>
	</xsl:variable>
	<xsl:variable name="ContactForPendingResults" as="xs:string" select="'Sie erhalten Ihre Ergebnisse in den n&#228;chsten 72 Stunden.'"/>
	
	<xsl:variable name="measValueUnit" as="xs:string" select="'%s %s'"/>
	<xsl:variable name="orderDateFormat" as="xs:string" select="'%s (%s)'"/>
	<xsl:variable name="measValueFormat" as="xs:string" select="'%s - %s'"/>
	<xsl:variable name="measValueDateFormat" as="xs:string" select="'%s - %s (%s)'"/>
	
	<xsl:variable name="laboratoryCatalogMeaning" as="xs:string" select="'GENERAL LAB'"/>
	<xsl:variable name="radiologyCatalogMeaning" as="xs:string" select="'RADIOLOGY'"/>
	
	<!-- overwrite displayInterfacedResults. If true, format will display lab measurements that are not tied to non-medication orders. -->
	<xsl:variable name="displayInterfacedResults" as="xs:boolean" select="false()"/>
	
	<!-- overwrite displayLabDetails. If true, format will display the details of lab measurements. -->
	<xsl:variable name="displayLabDetails" as="xs:boolean" select="false()"/>
	
	<!-- overwrite displayRadiologyOrders. If true, format will display radiology orders. -->
	<xsl:variable name="displayRadiologyOrders" as="xs:boolean" select="true()"/>
	
	<!-- overwrite displayPendingOrders. If true, format will display pending laboratory and radiology orders. -->
	<xsl:variable name="displayPendingOrders" as="xs:boolean" select="true()"/>
</xsl:stylesheet>