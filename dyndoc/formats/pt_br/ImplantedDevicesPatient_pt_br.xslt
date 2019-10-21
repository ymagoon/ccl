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
	<!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/pt_br/dateformat_pt_br.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="./dateformat_pt_br.xslt" /> -->

	<xsl:output method="html" encoding="UTF-8" indent="yes"/>

	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'pt_br'"/>

	<xsl:variable name="ImplantedThisVisitTitle" as="xs:string" select="'Implantado'"/>
	<xsl:variable name="ExplantedThisVisitTitle" as="xs:string" select="'Removido'"/>
	<xsl:variable name="MRUnsafeAlert" as="xs:string" select="'Aviso: h&#225; dispositivos nesta consulta que podem n&#227;o ser compat&#237;veis com a resson&#226;ncia magn&#233;tica.'"/>
	<xsl:variable name="MRPossiblyUnsafeAlert" as="xs:string" select="'Aviso: h&#225; dispositivos nesta consulta que podem n&#227;o ser compat&#237;veis com a resson&#226;ncia magn&#233;tica.'"/>
        <xsl:variable name="UnknownDeviceTitle" select="'Dispositivo desconhecido'"/>
        <xsl:variable name="UnknownProcedureTitle" select="'Procedimento desconhecido'"/>
        <xsl:variable name="UndefinedBodySiteTitle" select="'Regi&#227;o corporal indefinida'"/>
	<xsl:variable name="PatientFacing" as="xs:boolean" select="true()"/>
	<xsl:variable name="UDIDisplayFormat" select="' - Identificador &#250;nico do dispositivo: %s'"/>
</xsl:stylesheet>
