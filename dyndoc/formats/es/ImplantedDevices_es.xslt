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
	<!-- Comment this line to debug --><xsl:import href="/cernerbasiccontent/formats/es/dateformat_es.xslt"/>
	<!-- Uncomment this line to debug <xsl:import href="./dateformat_es.xslt" /> -->

	<xsl:output method="html" encoding="UTF-8" indent="yes"/>

	<!-- Locale defined for CommonFxn.xslt (If not defined, defaults to en_US, Value defined here overrides all other values) -->
	<xsl:param as="xs:string" name="current-locale" select="'es'"/>

	<xsl:variable name="ImplantedThisVisitTitle" as="xs:string" select="'Implantado en esta visita'"/>
	<xsl:variable name="ExplantedThisVisitTitle" as="xs:string" select="'Retirado en esta visita'"/>
	<xsl:variable name="MRUnsafeAlert" as="xs:string" select="'Aviso: en esta visita se le han implantado al paciente dispositivos que pueden no ser compatibles con la RM.'"/>
	<xsl:variable name="MRPossiblyUnsafeAlert" as="xs:string" select="'Aviso: en esta visita se le han implantado al paciente dispositivos que pueden no ser compatibles con la RM.'"/>
        <xsl:variable name="UnknownDeviceTitle" select="'Dispositivo desconocido'"/>
        <xsl:variable name="UnknownProcedureTitle" select="'Procedimiento desconocido'"/>
        <xsl:variable name="UndefinedBodySiteTitle" select="'Zona del cuerpo sin definir'"/>
	<xsl:variable name="PatientFacing" as="xs:boolean" select="false()"/>
    <xsl:variable name="UDIDisplayFormat" select="' - UDI: %s'"/>
</xsl:stylesheet>
