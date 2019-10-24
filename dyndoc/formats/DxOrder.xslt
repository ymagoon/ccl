<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="1.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:n="urn:com-cerner-patient-ehr:v3"
	xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
	xmlns:dd="DynamicDocumentation"
	exclude-result-prefixes="xsl xs fn n cdocfx">

	<xsl:output method="html" encoding="UTF-8" indent="yes"/>

	<xsl:param as="xs:string" name="current-locale" select="'en_US'"/>
	<xsl:param name="lUserId" select="0" />

	<!-- required to include CommonFxn.xslt -->
	<!-- Comment this line to debug --> <xsl:include href="/cernerbasiccontent/formats/dxcommonfxn.xslt" />
	<!-- Uncomment this line to debug <xsl:include href="dxcommonfxn.xslt" /> --> 

	<!-- Default string constants -->
	<xsl:variable name="Ordered" as="xs:string">
		<xsl:value-of select="'Ordered: '"/>
	</xsl:variable>
	<xsl:variable name="AdditionalOrders" as="xs:string">
		<xsl:value-of select="'Orders: '"/>
	</xsl:variable>
	<xsl:variable name="Comments" as="xs:string">
		<xsl:value-of select="'&#160;'"/>
	</xsl:variable>
	<xsl:variable name="entityIdList" as="element()*">
		<xsl:copy-of select="cdocfx:createEntityidList(n:report/n:format-inputs)"/>
	</xsl:variable>
		
	

	<!-- Note:
			Any changes to the diagnosis after it's been associated to an order will result in the diagnosis having a new id.
			So, we cannot rely on the diagnosis-id and instead have to rely on the nomenclature-id of the diagnosis to
			ensure that the order/Dx association flows through properly into the note. -->

	<!-- Keys -->
	<xsl:key name="keyDxMedsOrders" match="n:report/n:clinical-data/n:order-data/n:medication-order/n:diagnosis" use="@nomenclature-id"/>
	<xsl:key name="keyDxNonMedsOrders" match="n:report/n:clinical-data/n:order-data/n:non-medication-order/n:diagnosis" use="@nomenclature-id"/>
	<!--Keys for Future Order using icd9-nomenclature-id-->
	<xsl:key name="keyFutureDxMedsOrders" match="n:report/n:clinical-data/n:order-data/n:medication-order/n:icd9-nomenclature-id" use="."/>
	<xsl:key name="keyFutureDxNonMedsOrders" match="n:report/n:clinical-data/n:order-data/n:non-medication-order/n:icd9-nomenclature-id" use="."/>
	<!-- Functions -->

	<!-- Detect if given order has been banned meaning that it should not be displayed. Possible reasons to not want to
		display an order would be if it was system generated, or so common as to be noise instead of value added. -->
	<!-- Parameters: -->
	<!-- 	order - the order node -->
	<xsl:function name="cdocfx:isBannedOrder" as="xs:boolean">
		<xsl:param name="order"/>
		<xsl:choose>
			<!-- ATTENTION - Update the following and add any additional use cases needed here. Note that you can
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

	<!-- Detect if given order is associated with any of the given diagnosis -->
	<!-- Parameters: -->
	<!-- 	order - the order node -->
	<!--	dxNomenIDs - array of qualified active diagnosis nomenclature ids -->
	<xsl:function name="cdocfx:isOrderAssociatedWithActiveDiagnosis" as="xs:boolean">
		<xsl:param name="order"/>
		<xsl:param name="dxNomenIDs"/>
		<xsl:choose>
			<xsl:when test="$order/n:diagnosis">
				<xsl:variable name="order_dxNomenIDs" select="$order/n:diagnosis/@nomenclature-id"/>
				<xsl:variable name="id_intersection" select="$order_dxNomenIDs[fn:count(fn:distinct-values(.|$dxNomenIDs))=count(fn:distinct-values($dxNomenIDs))]"/>
				<xsl:value-of select="fn:exists($id_intersection)"/>
			</xsl:when>
			<xsl:when test="$order/n:icd9-nomenclature-id">
				<xsl:variable name="order_dxNomenIDs" select="$order/n:icd9-nomenclature-id"/>
				<xsl:variable name="id_intersection" select="$order_dxNomenIDs[fn:count(fn:distinct-values(.|$dxNomenIDs))=count(fn:distinct-values($dxNomenIDs))]"/>
				<xsl:value-of select="fn:exists($id_intersection)"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="fn:false()"/>
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
			<xsl:value-of select="cdocfx:getDxPriorityDisplay($dx)" disable-output-escaping="yes"/>
			<xsl:value-of select="cdocfx:getDxDisplay($dx)"/>
	</xsl:template>

	<!-- Format the given medication order as ddemrcontentitem -->
	<!-- TODO: update meds order format in a future story -->
	<!-- Parameters: -->
	<!-- 	order - the medication order node -->
	<xsl:template name="tempMedicationOrder" match="/">
		<xsl:param name="order"/>
		<div class="ddemrcontentitem ddremovable">
			<xsl:attribute name="dd:entityid">
				<xsl:value-of select="$order/@order-id"/>
			</xsl:attribute>
			<xsl:attribute name="dd:contenttype">
				<xsl:text>MEDICATIONS</xsl:text>
			</xsl:attribute>
			<xsl:value-of select="$order/@reference-name"/>
			<xsl:if test="$order/@clinical-display-line">
				<xsl:text>, </xsl:text>
				<xsl:value-of select="$order/@clinical-display-line"/>
			</xsl:if>
		</div>
	</xsl:template>

	<!-- Format the given non-medication order as ddemrcontentitem -->
	<!-- Parameters: -->
	<!-- 	order - the non-medication order node -->
	<xsl:template name="tempNonMedicationOrder" match="/">
		<xsl:param name="order"/>
		<div class="ddemrcontentitem ddremovable">
			<xsl:attribute name="dd:entityid">
				<xsl:value-of select="$order/@order-id"/>
			</xsl:attribute>
			<xsl:attribute name="dd:contenttype">
				<xsl:text>NONMEDORDERS</xsl:text>
			</xsl:attribute>
			<xsl:value-of select="$order/@reference-name"/>
		</div>
	</xsl:template>

	<!-- format a table with given order list and text -->
	<!-- Parameters: -->
	<!-- 	medsOrders - the medication order node list -->
	<!-- 	nonMedsOrders - the non-medication order node list -->
	<!--	text - text that will fill into the first column of the table -->
	<xsl:template name="tempOrderList">
		<xsl:param name="medsOrders"/>
		<xsl:param name="nonMedsOrders"/>
		<xsl:param name="text" as="xs:string"/>
		<xsl:if test="fn:string-length($text)>0">
			<div style="display:table-cell;*float:left;padding-left:8px;padding-right:10px">
				<xsl:value-of select="$text"/>
			</div>
		</xsl:if>

		<div>
			<xsl:choose>
				<xsl:when test="fn:string-length($text)>0">
					<xsl:attribute name="style">
						<xsl:text>display:table-cell;*float:left</xsl:text>
					</xsl:attribute>
				</xsl:when>
				<xsl:otherwise>
					<xsl:attribute name="style">
						<xsl:text>padding-left:8px</xsl:text>
					</xsl:attribute>
				</xsl:otherwise>
			</xsl:choose>
			<!-- medication orders -->
			<xsl:if test="fn:exists($medsOrders)">
				<xsl:for-each select="$medsOrders">
					<xsl:sort select="fn:upper-case(@reference-name)" order="ascending"/>
						<xsl:call-template name="tempMedicationOrder">
							<xsl:with-param name="order" select="."/>
						</xsl:call-template>
				</xsl:for-each>
			</xsl:if>
			<!-- non-medication orders -->
			<xsl:if test="fn:exists($nonMedsOrders)">
				<xsl:for-each select="$nonMedsOrders">
					<xsl:sort select="fn:upper-case(@reference-name)" order="ascending"/>
						<xsl:call-template name="tempNonMedicationOrder">
							<xsl:with-param name="order" select="."/>
						</xsl:call-template>
				</xsl:for-each>
			</xsl:if>
		</div>
	</xsl:template>

	<!-- Format orders that associated to the given diagnoses -->
	<!-- Parameters: -->
	<!--	dxNomenId - diagnosis nomenclature id -->
	<xsl:template name="tempDxOrdersByNomenId">
		<xsl:param name="dxNomenId"/>

		<!-- Get orders that associated with current diagnosis and placed by the given user -->
		<xsl:variable name="medsOrders" select="key('keyDxMedsOrders', $dxNomenId, $root-node)/parent::node()[fn:not(cdocfx:isBannedOrder(.)) and @responsible-provider-id = $lUserId]"/>
		<xsl:variable name="nonMedsOrders" select="key('keyDxNonMedsOrders', $dxNomenId, $root-node)/parent::node()[fn:not(cdocfx:isBannedOrder(.)) and @responsible-provider-id = $lUserId]"/>

		<!--Future Orders also considered if associated with diagnosis -->
		<xsl:variable name="medsFutureOrders" select="key('keyFutureDxMedsOrders', $dxNomenId, $root-node)/parent::node()[fn:not(cdocfx:isBannedOrder(.)) and @responsible-provider-id = $lUserId]"/>
		<xsl:variable name="nonMedsFutureOrders" select="key('keyFutureDxNonMedsOrders', $dxNomenId, $root-node)/parent::node()[fn:not(cdocfx:isBannedOrder(.)) and @responsible-provider-id = $lUserId]"/>

		<!-- format associated orders -->
		<xsl:if test="fn:not(fn:empty($medsOrders) and fn:empty($nonMedsOrders) and fn:empty($medsFutureOrders) and fn:empty($nonMedsFutureOrders))">
			<div>
				<xsl:call-template name="tempOrderList">
					<xsl:with-param name="medsOrders" select="$medsOrders | $medsFutureOrders"/>
					<xsl:with-param name="nonMedsOrders" select="$nonMedsOrders | $nonMedsFutureOrders"/>
					<xsl:with-param name="text" select="$Ordered"/>
				</xsl:call-template>
			</div>
		</xsl:if>
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

		<!-- for the given dxNomenId corresponding diagnoses are picked up from the dxList -->
		<xsl:variable name="matchingDiagnosesList" as="element()*">
			<xsl:copy-of select="cdocfx:getDiagnosesForMatchingNomenID($dxNomenId,$dxList)"/>
		</xsl:variable>

		<xsl:variable name="dxSize" select="fn:count($matchingDiagnosesList)"/>
		
		<xsl:choose>
			<xsl:when test="$dxSize>1">
				<div class="ddgrouper ddremovable" style = "clear:both">
				
						<xsl:for-each select="$matchingDiagnosesList">
							<xsl:sort select="cdocfx:getDxPriority(.)" order="ascending"/>
							<xsl:sort select="fn:upper-case(cdocfx:getDxDisplay(.))" order="ascending"/>
							
							<span class="ddemrcontentitem">
								<!-- Format diagnosis item -->
								<xsl:attribute name="dd:entityid">
									<xsl:value-of select="@id"/>
								</xsl:attribute>
								<xsl:attribute name="dd:contenttype">
									<xsl:text>DIAGNOSES</xsl:text>
								</xsl:attribute>
								<!-- Diagnosis having the same nomenclature are grouped together, we display priority for only
							 		first diagnosis as it has the highest priority in a nomenclature group. -->
									
								<xsl:if test="fn:position() = 1">
									<xsl:value-of select="cdocfx:getDxPriorityDisplay(.)" disable-output-escaping="yes"/>
								</xsl:if>
								<xsl:value-of select="cdocfx:getDxDisplay(.)"/>
								<xsl:if test="fn:not(fn:position() = fn:last())">
									<xsl:text disable-output-escaping="yes">,<![CDATA[&#160;]]></xsl:text>
								</xsl:if>
							</span>
						</xsl:for-each>
						<div style="margin-left:8px" class="ddfreetext ddremovable" dd:btnfloatingstyle="top-right"><xsl:value-of select="$Comments"/></div>

					<xsl:call-template name="tempDxOrdersByNomenId">
						<xsl:with-param name="dxNomenId" select="$dxNomenId"/>
					</xsl:call-template>
					<!-- add space between diagnosis only when has at least one order that associated with a active diagnosis -->
					<div style = "clear:both">
						<xsl:if test="$hasDxOrders">
							<span><xsl:text disable-output-escaping="yes"> <![CDATA[&#160;]]></xsl:text></span>
						</xsl:if>
					</div>
				</div>
			</xsl:when>
			<xsl:when test="$dxSize=1">
				<div class="ddemrcontentitem ddremovable" style = "clear:both">
					<!-- Format diagnosis item -->
					<xsl:call-template name="tempClinicalDiagnosis">
						<xsl:with-param name="dx" select="$dxList[1]"/>
					</xsl:call-template>
					<div style="margin-left:8px" class="ddfreetext ddremovable" dd:btnfloatingstyle="top-right"><xsl:value-of select="$Comments"/></div>
					<xsl:call-template name="tempDxOrdersByNomenId">
						<xsl:with-param name="dxNomenId" select="$dxNomenId"/>
					</xsl:call-template>
					
					<!-- add space between diagnosis only when has at least one order that associated with a active diagnosis -->
					<div style = "clear:both">
						<xsl:if test="$hasDxOrders">
							<span><xsl:text disable-output-escaping="yes"> <![CDATA[&#160;]]></xsl:text></span>
						</xsl:if>
					</div>
				</div>
			</xsl:when>
		</xsl:choose>
	</xsl:template>

	<!-- Recursively format diagnoses and associated orders by given list of clinical-diagnosis nodes -->
	<!-- Parameters: -->
	<!--	dxNomenId - diagnosis nomenclature ids that has been handled -->
	<!-- 	dxList - a list of diagnosis-data node -->
	<!--	hasDxOrders - indicate if has order(s) that associated with active diagnosis -->
	<xsl:template name="tempClinicalDiagnoses">
		<xsl:param name="dxNomenIDs"/>
		<xsl:param name="dxList"/>
		<xsl:param name="hasDxOrders" as="xs:boolean"/>
		<xsl:variable name="diagnosis" select="$dxList[1]"/>
		<xsl:if test="fn:count($dxList)>0">
			<xsl:choose>
				<!-- this diagnosis has nomenclature -->
				<xsl:when test="$diagnosis/n:diagnosis-name/n:nomenclature">
					<xsl:variable name="nomenId" select="$diagnosis/n:diagnosis-name/n:nomenclature"/>
					<xsl:choose>
						<!-- Diagnosis with nomenclature id that has been rendered -->
						<xsl:when test="fn:count(fn:distinct-values($nomenId|$dxNomenIDs))=count(fn:distinct-values($dxNomenIDs))">
							<!-- Ignore and move on to next -->
							<xsl:if test="fn:count($dxList)>1">
								<xsl:call-template name="tempClinicalDiagnoses">
									<xsl:with-param name="dxNomenIDs" select="$dxNomenIDs"/>
									<xsl:with-param name="dxList" select="$dxList[position() &gt; 1]"/>
									<xsl:with-param name="hasDxOrders" select="$hasDxOrders"/>
								</xsl:call-template>
							</xsl:if>
						</xsl:when>
						<!-- Diagnosis with nomenclature id that has NOT been rendered -->
						<xsl:otherwise>
							<!-- Render all diagnoses with the same nomenclature and orders associated with them -->
							<xsl:call-template name="tempDiagnosisByNomenId">
								<xsl:with-param name="dxNomenId" select="$nomenId"/>
								<xsl:with-param name="dxList" select="$dxList"/>
								<xsl:with-param name="hasDxOrders" select="$hasDxOrders"/>
							</xsl:call-template>
							<!-- Add nomenclature id to the handled list, and move on the rest of the diagnoses list -->
							<xsl:if test="fn:count($dxList)>1">
								<xsl:call-template name="tempClinicalDiagnoses">
									<xsl:with-param name="dxNomenIDs" select="$dxNomenIDs|$nomenId"/>
									<xsl:with-param name="dxList" select="$dxList[position() &gt; 1]"/>
									<xsl:with-param name="hasDxOrders" select="$hasDxOrders"/>
								</xsl:call-template>
							</xsl:if>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:when>
				<!-- this is a free text diagnosis -->
				<xsl:otherwise>
					<!-- Render this diagnosis -->
					<div class="ddemrcontentitem ddremovable">
						<!-- Format diagnosis item -->
						<xsl:call-template name="tempClinicalDiagnosis">
							<xsl:with-param name="dx" select="$diagnosis"/>
						</xsl:call-template>
						<span><xsl:text disable-output-escaping="yes"> <![CDATA[&#160;]]></xsl:text></span>
						<div style="margin-left:8px" class="ddfreetext ddremovable" dd:btnfloatingstyle="top-right"><xsl:value-of select="$Comments"/></div>
						<!-- add space between diagnosis only when has at least one order that associated with a active diagnosis -->
						<div style = "clear:both">
							<xsl:if test="$hasDxOrders">
								<span><xsl:text disable-output-escaping="yes"> <![CDATA[&#160;]]></xsl:text></span>
							</xsl:if>
						</div>
					</div>
					<!-- And move on to next -->
					<xsl:if test="fn:count($dxList)>1">
						<xsl:call-template name="tempClinicalDiagnoses">
							<xsl:with-param name="dxNomenIDs" select="$dxNomenIDs"/>
							<xsl:with-param name="dxList" select="$dxList[position() &gt; 1]"/>
							<xsl:with-param name="hasDxOrders" select="$hasDxOrders"/>
						</xsl:call-template>
					</xsl:if>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:if>
	</xsl:template>

	<!-- main template -->
	<xsl:template match="/">
		
		<!-- dxList is the list of diagnoses which are qualified for display  -->		
		<xsl:variable name="dxList" as="element()*">
			<xsl:copy-of select="cdocfx:getDisplayableDiagnoses(n:report/n:clinical-data/n:diagnosis-data/n:clinical-diagnosis,$entityIdList)"/>
		</xsl:variable>
		
		<!-- Get qualified diagnosis nomenclature ids -->
		<xsl:variable name="dxNomenIDs" select="$dxList/n:diagnosis-name/n:nomenclature"/>

		<!-- Get all medication/non-medication orders that is placed by the given user -->
		<xsl:variable name="medsOrders" select="n:report/n:clinical-data/n:order-data/n:medication-order[fn:not(cdocfx:isBannedOrder(.)) and @responsible-provider-id = $lUserId]"/>
		<xsl:variable name="nonMedsOrders" select="n:report/n:clinical-data/n:order-data/n:non-medication-order[fn:not(cdocfx:isBannedOrder(.)) and @responsible-provider-id = $lUserId]"/>

		<!-- Get all medication/non-medication orders that are not associated with any active diagnosis and placed by the given user -->
		<xsl:variable name="addtnlMedsOrders" select="n:report/n:clinical-data/n:order-data/n:medication-order[fn:not(cdocfx:isOrderAssociatedWithActiveDiagnosis(., $dxNomenIDs)) and fn:not(cdocfx:isBannedOrder(.)) and @responsible-provider-id = $lUserId]"/>
		<xsl:variable name="addtnlNonMedsOrders" select="n:report/n:clinical-data/n:order-data/n:non-medication-order[fn:not(cdocfx:isOrderAssociatedWithActiveDiagnosis(., $dxNomenIDs)) and fn:not(cdocfx:isBannedOrder(.)) and @responsible-provider-id = $lUserId]"/>

		<xsl:variable name="hasAddtnlOrders" select="fn:exists($addtnlMedsOrders) or fn:exists($addtnlNonMedsOrders)" as="xs:boolean"/>
		<xsl:variable name="hasDxOrders" select="fn:not((fn:count($medsOrders)=fn:count($addtnlMedsOrders)) and (fn:count($nonMedsOrders)=fn:count($addtnlNonMedsOrders)))" as="xs:boolean"/>
		<xsl:variable name="addtnlTitle">
			<xsl:choose>
				<xsl:when test="fn:exists($dxList)">
					<xsl:value-of select="$AdditionalOrders"/>
				</xsl:when>
				<xsl:otherwise>
						<xsl:value-of select="$Ordered"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>

		<!-- Format diagnoses and associated orders -->
		<xsl:if test="fn:count($dxList)>0">
			<xsl:call-template name="tempClinicalDiagnoses">
				<xsl:with-param name="dxNomenIDs" select="/.."/>
				<xsl:with-param name="dxList" select="$dxList"/>
				<xsl:with-param name="hasDxOrders" select="$hasDxOrders"/>
			</xsl:call-template>
		</xsl:if>

		<!-- format additional orders -->
		<xsl:if test="$hasAddtnlOrders">
			<!-- Generate EMR content item and text for additional orders -->
			<div class="ddemrcontentitem ddremovable" style = "clear:both">
				<xsl:attribute name="dd:entityid">
					<xsl:value-of select="0"/>
				</xsl:attribute>
				<xsl:value-of select="$AdditionalOrders" />
				<xsl:call-template name="tempOrderList">
					<xsl:with-param name="medsOrders" select="$addtnlMedsOrders"/>
					<xsl:with-param name="nonMedsOrders" select="$addtnlNonMedsOrders"/>
					<xsl:with-param name="text" select="fn:string('')"/>
				</xsl:call-template>
			</div>
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>
