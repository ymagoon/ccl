<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	xmlns:xs="http://www.w3.org/2001/XMLSchema" 
	xmlns:fn="http://www.w3.org/2005/xpath-functions" 
	xmlns:n="urn:com-cerner-patient-ehr:v3" 
	xmlns:dd="DynamicDocumentation" 
	exclude-result-prefixes="xsl xs fn n dd">
	
	<!-- Comment this line to debug --> <xsl:import href="/cernerbasiccontent/formats/implanteddevices.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="../implanteddevices.xslt" /> -->
	<!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/nl/dateformat_nl.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="./dateformat_nl.xslt" /> -->

	<xsl:output method="html" encoding="UTF-8" indent="yes"/>

	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'nl'"/>

	<xsl:variable name="ImplantedThisVisitTitle" as="xs:string" select="'Implantaat'"/>
	<xsl:variable name="ExplantedThisVisitTitle" as="xs:string" select="'Verwijderd'"/>
	<xsl:variable name="MRUnsafeAlert" as="xs:string" select="'Opmerking: U heeft implantaten gekregen bij dit bezoek die niet MRI-compatibel zijn.'"/>
	<xsl:variable name="MRPossiblyUnsafeAlert" as="xs:string" select="'Opmerking: U heeft implantaten gekregen bij dit bezoek die mogelijk niet MRI-compatibel zijn.'"/>
	<xsl:variable name="UnknownDeviceTitle" select="'Onbekend apparaat'"/>
        <xsl:variable name="UnknownProcedureTitle" select="'Niet-gedefinieerde procedure'"/>
        <xsl:variable name="UndefinedBodySiteTitle" select="'Plaats op het lichaam niet gedefinieerd'"/>
	<xsl:variable name="PatientFacing" as="xs:boolean" select="true()"/>
	<xsl:variable name="UDIDisplayFormat" select="' - UDI: %s'"/>
</xsl:stylesheet>
