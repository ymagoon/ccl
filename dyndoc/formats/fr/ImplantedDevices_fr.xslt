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
	<!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/fr/dateformat_fr.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="./dateformat_fr.xslt" /> -->

	<xsl:output method="html" encoding="UTF-8" indent="yes"/>

	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'fr'"/>

	<xsl:variable name="ImplantedThisVisitTitle" as="xs:string" select="'Implant&#233; pendant ce s&#233;jour'"/>
	<xsl:variable name="ExplantedThisVisitTitle" as="xs:string" select="'Retir&#233; pendant ce s&#233;jour'"/>
	<xsl:variable name="MRUnsafeAlert" as="xs:string" select="'Remarque : les dispositifs implant&#233;s pendant ce s&#233;jour &#224; ce patient peuvent &#234;tre incompatibles avec un examen IRM.'"/>
	<xsl:variable name="MRPossiblyUnsafeAlert" as="xs:string" select="'Remarque : les dispositifs implant&#233;s pendant ce s&#233;jour &#224; ce patient peuvent &#234;tre incompatibles avec un examen IRM.'"/>
        <xsl:variable name="UnknownDeviceTitle" select="'Dispositif inconnu'"/>
        <xsl:variable name="UnknownProcedureTitle" select="'Proc&#233;dure inconnue'"/>
        <xsl:variable name="UndefinedBodySiteTitle" select="'Site de pr&#233;l&#232;vement non d&#233;fini'"/>
	<xsl:variable name="PatientFacing" as="xs:boolean" select="false()"/>
	<xsl:variable name="UDIDisplayFormat" select="' - Identifiant unique du dispositif: %s'"/>
</xsl:stylesheet>
