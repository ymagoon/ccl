<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="3.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:n="urn:com-cerner-patient-ehr:v3"
	xmlns:java-string="java:java.lang.String"
	xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
	xmlns:dd="DynamicDocumentation"
	exclude-result-prefixes="xsl xs fn n cdocfx">

	<xsl:output method="html" encoding="UTF-8" indent="yes"/>

	<xsl:param as="xs:string" name="current-locale" select="'en_US'"/>
	
	<xsl:variable name="Separator" as="xs:string">
		<xsl:value-of select="', %s'"/>
	</xsl:variable>

	<!-- required to include CommonFxn.xslt -->
	<!-- Comment this line to debug --><xsl:include href="/cernerbasiccontent/formats/commonfxn.xslt" /> 
	<!-- Uncomment this line to debug  <xsl:include href="commonfxn.xslt" /> -->

	<!-- Keys -->
	<xsl:key name="orderCatalogsByCatalogId" match="n:report/n:order-catalog-list/n:order-catalog" use="@order-catalog-id"/>
	<!-- Functions -->
	<!-- This function validates if an order is of the given catalog-type-meaning -->
	<!-- Parameters: -->
	<!-- 	order - a medication or non-medication order node -->
	<!-- 	catalogTypeMeaning - the expected catalog type meaning -->
	<xsl:function name="cdocfx:isCatalogTypeCdOrder" as="xs:boolean">
		<xsl:param name="order" />
		<xsl:param name="catalogTypeMeaning" as="xs:string"/>
		<xsl:variable name="order_catalog_element" select="key('order_catalog', $order/n:order-synonym/@order-catalog-id, $root-node)"/>
		<xsl:choose>
			<xsl:when test="$order_catalog_element">
				<xsl:variable name="catalog-type-meaning" select="cdocfx:getCodeMeanByID($order_catalog_element/@catalog-type-code)" as="xs:string"/>
				<xsl:choose>
					<xsl:when test="$catalog-type-meaning = $catalogTypeMeaning">
						<xsl:value-of select="fn:true()"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="fn:false()"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="fn:false()"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>
	
	<!-- This function validates if an order is of the given activity-type-meaning -->
	<!-- Parameters: -->
	<!-- 	order - a medication or non-medication order node -->
	<!-- 	activityTypeMeaning - the expected activity type meaning -->
	<xsl:function name="cdocfx:isActivityTypeCdOrder" as="xs:boolean">
		<xsl:param name="order" />
		<xsl:param name="activityTypeMeaning" as="xs:string"/>
		<xsl:variable name="order_catalog_element" select="key('order_catalog', $order/n:order-synonym/@order-catalog-id, $root-node)"/>
		<xsl:choose>
			<xsl:when test="$order_catalog_element">
				<xsl:variable name="activity-type-meaning" select="cdocfx:getCodeMeanByID($order_catalog_element/@activity-type-code)" as="xs:string"/>
				<xsl:choose>
					<xsl:when test="$activity-type-meaning = $activityTypeMeaning">
						<xsl:value-of select="fn:true()"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="fn:false()"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="fn:false()"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>

	<!-- Detect if given order has been banned meaning that it should not be displayed. Possible reasons to not want to
		display an order would be if it was system generated, or so common as to be noise instead of value added. -->
	<!-- Parameters: -->
	<!-- 	order - the order node -->
	<xsl:function name="cdocfx:isBannedOrder" as="xs:boolean">
		<xsl:param name="order"/>
		<xsl:choose>
			<!-- ATTENTION - Update the following and add any aditional use cases needed here. Note that you can 
				filter on other fields here as well, but you want to keep the total number of conditions 
				being checked to a minimum for performance reasons. -->
			<xsl:when test="$order[@clinical-name='PLACE_BANNED_ORDER_NAME_HERE']">
				<xsl:value-of select="fn:true()"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="fn:false()"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>
	
	<!-- Function to get CDF Meaning given the order. Returns a large string when CDF meaning is empty -->
	<!-- Parameters: -->
	<!-- 	order - the medication-order or the non-medication-order node -->
	<xsl:function name="cdocfx:getCodeMeanByOrder">
		<xsl:param name="order"/>   
		<xsl:variable name="orderCatalog" select="key('orderCatalogsByCatalogId', $order/n:order-synonym/@order-catalog-id, $root-node)"/>
		
		<xsl:if test="$orderCatalog">
			<xsl:variable name="orderCatalogMean" as="xs:string" select="cdocfx:getCodeMeanByID($orderCatalog/@catalog-type-code)"/>
			
			<!-- If CDF meaning is empty, set it to a large value -->
			<xsl:choose>
				<xsl:when test="$orderCatalogMean != ''">
					<xsl:value-of select="$orderCatalogMean"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="'ZZZZZZZZ'"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:if>
	</xsl:function>
	
	<!-- Templates -->	
	<!-- Format the given medication order as ddemrcontentitem -->
	<!-- Parameters: -->
	<!-- 	order - the medication order node -->
	<xsl:template name="tempMedicationOrder" >
		<xsl:param name="order"/>
		<div class="ddemrcontentitem ddremovable" dd:btnfloatingstyle="top-right">
			<div style="margin-left: 1em; text-indent: -1em;">
				<xsl:attribute name="dd:entityid">
					<xsl:value-of select="$order/@order-id"/>
				</xsl:attribute>
				<xsl:attribute name="dd:contenttype">
					<xsl:text>MEDICATIONS</xsl:text>
				</xsl:attribute>
				<xsl:value-of select="$order/@reference-name"/>
				<xsl:if test="$order/@clinical-display-line">
					<xsl:variable name="ClinicalDisplayLine" as="xs:string" select="$order/@clinical-display-line" />
					<xsl:value-of select="java-string:format($Separator, $ClinicalDisplayLine)"/>
				</xsl:if>
			</div>
		</div>
	</xsl:template>

	<!-- Format the given non-medication order as ddemrcontentitem -->
	<!-- Parameters: -->
	<!-- 	order - the non-medication order node -->
	<xsl:template name="tempNonMedicationOrder" >
		<xsl:param name="order"/>
		<div class="ddemrcontentitem ddremovable" dd:btnfloatingstyle="top-right">
			<div style="margin-left: 1em; text-indent: -1em;">
				<xsl:attribute name="dd:entityid">
					<xsl:value-of select="$order/@order-id"/>
				</xsl:attribute>
				<xsl:attribute name="dd:contenttype">
					<xsl:text>NONMEDORDERS</xsl:text>
				</xsl:attribute>
				<xsl:value-of select="$order/@reference-name"/>
				<xsl:if test="$order/@clinical-display-line">
					<xsl:variable name="ClinicalDisplayLine" as="xs:string" select="$order/@clinical-display-line" />
					<xsl:value-of select="java-string:format($Separator, $ClinicalDisplayLine)"/>
				</xsl:if>
			</div>
		</div>
	</xsl:template>

	<!-- Format given order lists -->
	<!-- Parameters: -->
	<!-- 	medsOrders - the medication order node list -->
	<!-- 	nonMedsOrders - the non-medication order node list -->
	<xsl:template name="tempOrderList">
		<xsl:param name="medsOrders"/>
		<xsl:param name="nonMedsOrders"/>
		
		<!-- medication orders -->
		<xsl:if test="fn:exists($medsOrders)">
			<xsl:for-each select="$medsOrders">
				<xsl:sort select="fn:upper-case(cdocfx:getCodeMeanByOrder(.))" data-type="text" order="ascending"/>
				<xsl:sort select="fn:upper-case(@reference-name)" order="ascending"/>
					<xsl:call-template name="tempMedicationOrder">
						<xsl:with-param name="order" select="."/>
					</xsl:call-template>
			</xsl:for-each>
		</xsl:if>
		
		<!-- non-medication orders -->
		<xsl:if test="fn:exists($nonMedsOrders)">
			<xsl:for-each select="$nonMedsOrders">
				<xsl:sort select="fn:upper-case(cdocfx:getCodeMeanByOrder(.))" data-type="text" order="ascending"/>
				<xsl:sort select="fn:upper-case(@reference-name)" order="ascending"/>
					<xsl:call-template name="tempNonMedicationOrder">
						<xsl:with-param name="order" select="."/>
					</xsl:call-template>
			</xsl:for-each>
		</xsl:if>
	</xsl:template>

	<!-- main template -->
	<xsl:template match="/">

		<!-- Get all medication/non-medication orders -->
		<xsl:variable name="medsOrders" select="n:report/n:clinical-data/n:order-data/n:medication-order[fn:not(cdocfx:isBannedOrder(.))]"/>
		<xsl:variable name="nonMedsOrders" select="n:report/n:clinical-data/n:order-data/n:non-medication-order[fn:not(cdocfx:isBannedOrder(.))]"/>

		<!-- format all orders -->
		<xsl:call-template name="tempOrderList">
			<xsl:with-param name="medsOrders" select="$medsOrders"/>
			<xsl:with-param name="nonMedsOrders" select="$nonMedsOrders"/>
		</xsl:call-template>
		
	</xsl:template>
</xsl:stylesheet>
