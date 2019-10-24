<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="1.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:n="urn:com-cerner-patient-ehr:v3"
	xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
	xmlns:dd="DynamicDocumentation"
	exclude-result-prefixes="xsl xs fn n cdocfx">

	<xsl:output method="html" encoding="UTF-8" indent="yes"/>

	<xsl:param as="xs:string" name="current-locale" select="'en_US'"/>
	<xsl:param name="lUserId" select="0" />

	<!-- required to include CommonFxn.xslt -->
	<!-- Comment this line to debug --><xsl:include href="/cernerbasiccontent/formats/commonfxn.xslt" /> 
	<!-- Uncomment this line to debug  <xsl:include href="commonfxn.xslt" /> -->

	<!-- Keys -->
	<xsl:key name="keyDxByNomenId" match="n:report/n:clinical-data/n:diagnosis-data/n:clinical-diagnosis" use="n:diagnosis-name/n:nomenclature"/>

	<!-- Functions -->
	<!-- Detect if given order is associated with any of the given diagnosis -->
	<!-- Parameters: -->
	<!-- 	order - the order node -->
	<!--	dxNomenIDs - array of active diagnosis nomenclature ids -->
	<xsl:function name="cdocfx:isOrderAssociatedWithActiveDiagnosis" as="xs:boolean">
		<xsl:param name="order"/>
		<xsl:param name="dxNomenIDs"/>
		<xsl:choose>
			<xsl:when test="$order/n:diagnosis">
				<xsl:variable name="order_dxNomenIDs" select="$order/n:diagnosis/@nomenclature-id"/>
				<xsl:variable name="id_intersection" select="$order_dxNomenIDs[fn:count(fn:distinct-values(.|$dxNomenIDs))=count(fn:distinct-values($dxNomenIDs))]"/>
				<xsl:value-of select="fn:exists($id_intersection)"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="fn:false()"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>

	<!-- Get dispay of the given diagnosis. Use diagnosis-name/freetext when available, otherwise attribute annotated-display -->
	<!-- Parameters: -->
	<!--	dx - diagnosis object -->
	<xsl:function name="cdocfx:getDxDisplay" as="xs:string">
		<xsl:param name="dx"/>
		<xsl:choose>
			<xsl:when test="$dx/n:diagnosis-name/n:freetext">
				<xsl:value-of select="$dx/n:diagnosis-name/n:freetext"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$dx/@annotated-display" />
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>

	<!-- Templates -->
	<!-- Format given diagnosis by populating ddemrcontentitem attributes and text -->
	<!-- Parameters: -->
	<!--	dx - diagnosis node -->
	<xsl:template name="tempClinicalDiagnosis" >
		<xsl:param name="dx"/>
			<xsl:attribute name="dd:entityid">
				<xsl:value-of select="$dx/@id"/>
			</xsl:attribute>
			<xsl:attribute name="dd:contenttype">
				<xsl:text>DIAGNOSES</xsl:text>
			</xsl:attribute>
		<xsl:value-of select="cdocfx:getNomenclatureDescByID($dx/n:diagnosis-name/n:nomenclature)"/>
	</xsl:template>

	<!-- Format diagnoses and associated orders by given nomenclature id and clinical-diagnosis nodes -->
	<!-- Parameters: -->
	<!--	dxNomenId - diagnosis nomenclature id -->
	<!-- 	dxList - a list of diagnosis-data node -->
	<!--	hasDxOrders - indicate if has order(s) that associated with active diagnosis -->
	<xsl:template name="tempDiagnosisByNomenId">
		<xsl:param name="dxNomenId" as="xs:string"/>
		<xsl:param name="dxList"/>
		<xsl:param name="hasDxOrders" as="xs:boolean"/>

		<xsl:variable name="dxSize" select="fn:count($dxList)"/>
				<div class="ddemrcontentitem ddremovable">
					<!-- Format diagnosis item -->
					<xsl:call-template name="tempClinicalDiagnosis">
						<xsl:with-param name="dx" select="$dxList[1]"/>
					</xsl:call-template>
					<br/>
				</div>

	</xsl:template>


	<!-- main template -->
	<xsl:template match="/">
		<!-- Get all diagnosis nomenclature ids -->
		<xsl:variable name="dxSorted">
			<xsl:perform-sort select="n:report/n:clinical-data/n:diagnosis-data/n:clinical-diagnosis">
				<xsl:sort select="fn:upper-case(cdocfx:getDxDisplay(.))" order="ascending"/>
			</xsl:perform-sort>
		</xsl:variable>
		<xsl:variable name="dxNomenIDs" select="$dxSorted/n:clinical-diagnosis/n:diagnosis-name/n:nomenclature[../../@is-active='true']"/>

		<!-- Get all mediacation/non-medication orders that is placed by the given user -->
		<xsl:variable name="medsOrders" select="n:report/n:clinical-data/n:order-data/n:medication-order[@responsible-provider-id = $lUserId]"/>
		<xsl:variable name="nonMedsOrders" select="n:report/n:clinical-data/n:order-data/n:non-medication-order[@responsible-provider-id = $lUserId]"/>

		<!-- Get all medication/non-medication orders that are not associated with any active diagnosis and placed by the given user -->
		<xsl:variable name="addtnlMedsOrders" select="n:report/n:clinical-data/n:order-data/n:medication-order[fn:not(cdocfx:isOrderAssociatedWithActiveDiagnosis(., $dxNomenIDs)) and @responsible-provider-id = $lUserId]"/>
		<xsl:variable name="addtnlNonMedsOrders" select="n:report/n:clinical-data/n:order-data/n:non-medication-order[fn:not(cdocfx:isOrderAssociatedWithActiveDiagnosis(., $dxNomenIDs)) and @responsible-provider-id = $lUserId]"/>

		<xsl:variable name="hasAddtnlOrders" select="fn:exists($addtnlMedsOrders) or fn:exists($addtnlNonMedsOrders)" as="xs:boolean"/>
		<xsl:variable name="hasDxOrders" select="fn:not((fn:count($medsOrders)=fn:count($addtnlMedsOrders)) and (fn:count($nonMedsOrders)=fn:count($addtnlNonMedsOrders)))" as="xs:boolean"/>
		<!-- Format diagnoses and associated orders -->
		<xsl:for-each select="fn:distinct-values($dxNomenIDs)">
			<xsl:call-template name="tempDiagnosisByNomenId">
				<xsl:with-param name="dxNomenId" select="."/>
				<xsl:with-param name="dxList" select="key('keyDxByNomenId', ., $root-node)[@is-active='true']"/>
				<xsl:with-param name="hasDxOrders" select="$hasDxOrders"/>
			</xsl:call-template>
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>
